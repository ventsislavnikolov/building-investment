-- =============================================================================
-- Building Investment Platform - Complete Database Schema
-- =============================================================================
-- Stack: Supabase (PostgreSQL) + Next.js + TypeScript
-- Pattern: Double-entry ledger, SPV isolation, RLS multi-role
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. EXTENSIONS
-- ---------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. ENUMS (truly fixed domain values)
-- ---------------------------------------------------------------------------

CREATE TYPE user_role AS ENUM ('investor', 'admin', 'project_owner');

CREATE TYPE kyc_status AS ENUM (
  'not_started',
  'pending',
  'approved',
  'rejected',
  'expired'
);

CREATE TYPE risk_profile AS ENUM (
  'conservative',
  'moderate',
  'aggressive'
);

CREATE TYPE project_strategy AS ENUM (
  'flip',           -- buy + renovate + sell
  'buy_to_rent',    -- buy + rent out
  'development',    -- build from scratch
  'land_prep',      -- land acquisition + permits + prep for construction
  'hybrid'          -- combination
);

CREATE TYPE project_status AS ENUM (
  'draft',
  'in_review',       -- internal DD
  'approved',        -- ready to list
  'fundraising',     -- accepting investments
  'funded',          -- target reached, funds locked
  'in_execution',    -- construction / renovation / management
  'exiting',         -- selling / winding down
  'completed',       -- returns distributed, SPV closed
  'failed',          -- project failed
  'cancelled'        -- cancelled before execution
);

CREATE TYPE investment_type AS ENUM (
  'equity',          -- shares in SPV
  'debt',            -- fixed/floating interest note
  'convertible'      -- debt convertible to equity
);

CREATE TYPE investment_status AS ENUM (
  'reserved',        -- investor committed, payment pending
  'pending_payment',
  'active',          -- paid and confirmed
  'returning',       -- returns being distributed
  'exited',          -- fully returned
  'cancelled',
  'refunded'
);

CREATE TYPE transaction_type AS ENUM (
  'deposit',         -- money in from investor
  'withdrawal',      -- money out to investor
  'investment',      -- wallet -> project SPV
  'return',          -- project SPV -> wallet (dividends/exit)
  'fee_platform',    -- platform fees
  'fee_management',  -- management fees
  'fee_performance', -- performance fees
  'refund',          -- investment refund
  'transfer'         -- internal transfer
);

CREATE TYPE ledger_entry_type AS ENUM ('debit', 'credit');

CREATE TYPE document_category AS ENUM (
  'legal',           -- SPV docs, contracts
  'financial',       -- budgets, reports, invoices
  'valuation',       -- property appraisals
  'permit',          -- building permits, licenses
  'insurance',
  'kyc',             -- investor identity docs
  'progress',        -- construction/renovation reports
  'kiis',            -- Key Investment Information Sheet
  'tax',
  'other'
);

CREATE TYPE milestone_status AS ENUM (
  'planned',
  'in_progress',
  'completed',
  'delayed',
  'cancelled'
);

CREATE TYPE notification_channel AS ENUM ('email', 'in_app', 'sms');

-- ---------------------------------------------------------------------------
-- 2. PROFILES (extends Supabase auth.users)
-- ---------------------------------------------------------------------------

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role            user_role NOT NULL DEFAULT 'investor',
  email           TEXT NOT NULL,
  first_name      TEXT,
  last_name       TEXT,
  phone           TEXT,
  avatar_url      TEXT,

  -- investor-specific
  investor_type   TEXT CHECK (investor_type IN ('individual', 'company')),
  company_name    TEXT,
  company_reg_no  TEXT,
  tax_residency   TEXT,           -- ISO 3166-1 alpha-2 country code
  risk_profile    risk_profile,
  accredited      BOOLEAN DEFAULT FALSE,

  -- KYC
  kyc_status      kyc_status NOT NULL DEFAULT 'not_started',
  kyc_provider_id TEXT,           -- external ID from Sumsub
  kyc_verified_at TIMESTAMPTZ,
  kyc_expires_at  TIMESTAMPTZ,

  -- preferences
  locale          TEXT NOT NULL DEFAULT 'bg' CHECK (locale IN ('bg', 'en')),
  currency        TEXT NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'BGN')),
  notification_preferences JSONB DEFAULT '{"email": true, "in_app": true, "sms": false}'::JSONB,

  -- metadata
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at   TIMESTAMPTZ,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_kyc_status ON profiles(kyc_status);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ---------------------------------------------------------------------------
-- 3. PROJECTS (investment opportunities / SPVs)
-- ---------------------------------------------------------------------------

CREATE TABLE projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT UNIQUE NOT NULL,     -- URL-friendly identifier

  -- basic info
  title_bg        TEXT NOT NULL,
  title_en        TEXT NOT NULL,
  description_bg  TEXT,
  description_en  TEXT,
  strategy        project_strategy NOT NULL,
  status          project_status NOT NULL DEFAULT 'draft',

  -- location
  country         TEXT NOT NULL DEFAULT 'BG',
  city            TEXT NOT NULL,
  district        TEXT,
  address         TEXT,                     -- revealed after investment
  latitude        NUMERIC(10, 7),
  longitude       NUMERIC(10, 7),

  -- property details
  property_type   TEXT NOT NULL CHECK (property_type IN (
    'apartment', 'house', 'land', 'commercial', 'building', 'mixed'
  )),
  area_sqm        NUMERIC(10, 2),
  land_area_sqm   NUMERIC(10, 2),

  -- fundraising
  target_amount   NUMERIC(14, 2) NOT NULL,  -- total capital needed
  min_investment  NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
  max_investment  NUMERIC(14, 2),           -- per investor cap
  currency        TEXT NOT NULL DEFAULT 'EUR',
  funded_amount   NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  investor_count  INTEGER NOT NULL DEFAULT 0,
  fundraise_start TIMESTAMPTZ,
  fundraise_end   TIMESTAMPTZ,

  -- financial projections
  purchase_price      NUMERIC(14, 2),
  renovation_cost     NUMERIC(14, 2),
  other_costs         NUMERIC(14, 2),       -- taxes, fees, legal
  reserve_fund        NUMERIC(14, 2),       -- contingency buffer
  expected_revenue    NUMERIC(14, 2),       -- sale price or annual rent
  projected_irr_min   NUMERIC(5, 2),        -- % e.g. 8.50
  projected_irr_max   NUMERIC(5, 2),        -- % e.g. 14.00
  projected_roi_min   NUMERIC(5, 2),
  projected_roi_max   NUMERIC(5, 2),

  -- timeline
  estimated_duration_months INTEGER,         -- base case
  worst_case_months   INTEGER,
  best_case_months    INTEGER,
  execution_start     TIMESTAMPTZ,
  execution_end       TIMESTAMPTZ,

  -- SPV info
  spv_name            TEXT,                 -- legal name of SPV
  spv_reg_number      TEXT,
  spv_country         TEXT DEFAULT 'BG',

  -- risk
  risk_score          INTEGER CHECK (risk_score BETWEEN 1 AND 10),
  ltv_ratio           NUMERIC(5, 2),        -- loan-to-value %

  -- waterfall / fee structure (stored as JSON for flexibility)
  waterfall_config    JSONB,
  -- Example:
  -- {
  --   "hurdle_rate": 8.0,
  --   "platform_origination_fee": 2.0,
  --   "platform_management_fee": 1.0,
  --   "platform_performance_fee": 20.0,
  --   "investor_priority_return": true,
  --   "distribution_frequency": "quarterly"
  -- }

  -- sensitivity analysis
  sensitivity_config  JSONB,
  -- Example:
  -- {
  --   "capex_increase_10pct": { "irr": 6.5 },
  --   "sale_price_decrease_10pct": { "irr": 5.0 },
  --   "delay_3_months": { "irr": 7.0 },
  --   "delay_6_months": { "irr": 5.5 }
  -- }

  -- cover images (array of storage paths)
  cover_images    TEXT[] DEFAULT '{}',
  gallery_images  TEXT[] DEFAULT '{}',

  -- admin
  created_by      UUID REFERENCES profiles(id),
  managed_by      UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at    TIMESTAMPTZ,
  funded_at       TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_strategy ON projects(strategy);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_country_city ON projects(country, city);
CREATE INDEX idx_projects_fundraise_dates ON projects(fundraise_start, fundraise_end);

-- ---------------------------------------------------------------------------
-- 4. INVESTMENTS (investor <-> project relationship)
-- ---------------------------------------------------------------------------

CREATE TABLE investments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  investor_id     UUID NOT NULL REFERENCES profiles(id),
  project_id      UUID NOT NULL REFERENCES projects(id),

  -- investment details
  type            investment_type NOT NULL DEFAULT 'equity',
  status          investment_status NOT NULL DEFAULT 'reserved',
  amount          NUMERIC(14, 2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'EUR',

  -- equity specifics
  shares_count    NUMERIC(14, 4),           -- number of shares/units
  ownership_pct   NUMERIC(7, 4),            -- percentage of SPV

  -- debt specifics
  interest_rate   NUMERIC(5, 2),            -- annual %
  maturity_date   DATE,

  -- terms
  terms_accepted  BOOLEAN NOT NULL DEFAULT FALSE,
  terms_accepted_at TIMESTAMPTZ,
  contract_doc_id UUID,                     -- reference to documents table

  -- payment
  stripe_payment_intent_id TEXT,
  paid_at         TIMESTAMPTZ,

  -- returns tracking
  total_returned  NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  realized_irr    NUMERIC(5, 2),
  realized_roi    NUMERIC(5, 2),

  -- metadata
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exited_at       TIMESTAMPTZ,

  CONSTRAINT positive_amount CHECK (amount > 0),
  CONSTRAINT valid_ownership CHECK (ownership_pct IS NULL OR (ownership_pct >= 0 AND ownership_pct <= 100))
);

CREATE INDEX idx_investments_investor ON investments(investor_id);
CREATE INDEX idx_investments_project ON investments(project_id);
CREATE INDEX idx_investments_status ON investments(status);
CREATE UNIQUE INDEX idx_investments_stripe ON investments(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 5. WALLET & LEDGER (double-entry bookkeeping)
-- ---------------------------------------------------------------------------

-- Ledger accounts: every investor has a wallet account, every SPV has accounts
CREATE TABLE ledger_accounts (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  account_type    TEXT NOT NULL CHECK (account_type IN (
    'investor_wallet',    -- investor's available balance
    'investor_invested',  -- investor's locked/invested balance
    'spv_escrow',         -- SPV escrow (fundraising)
    'spv_operating',      -- SPV operating account
    'platform_fees',      -- platform fee collection
    'platform_revenue'    -- platform revenue
  )),
  currency        TEXT NOT NULL DEFAULT 'EUR',
  owner_id        UUID,                     -- profile ID for investor accounts
  project_id      UUID REFERENCES projects(id), -- for SPV accounts
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT unique_investor_wallet UNIQUE (owner_id, account_type, currency)
);

CREATE INDEX idx_ledger_accounts_owner ON ledger_accounts(owner_id);
CREATE INDEX idx_ledger_accounts_project ON ledger_accounts(project_id);
CREATE INDEX idx_ledger_accounts_type ON ledger_accounts(account_type);

-- Transactions: groups related ledger entries
CREATE TABLE ledger_transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type            transaction_type NOT NULL,
  description     TEXT,
  reference_id    UUID,                     -- investment_id, project_id, etc.
  reference_type  TEXT,                     -- 'investment', 'distribution', etc.
  amount          NUMERIC(14, 2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'EUR',
  initiated_by    UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Stripe references
  stripe_transfer_id TEXT,
  stripe_charge_id   TEXT,

  CONSTRAINT positive_tx_amount CHECK (amount > 0)
);

CREATE INDEX idx_ledger_tx_type ON ledger_transactions(type);
CREATE INDEX idx_ledger_tx_reference ON ledger_transactions(reference_id, reference_type);
CREATE INDEX idx_ledger_tx_created ON ledger_transactions(created_at);

-- Ledger entries: individual debits/credits (immutable, append-only)
CREATE TABLE ledger_entries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id  UUID NOT NULL REFERENCES ledger_transactions(id),
  account_id      UUID NOT NULL REFERENCES ledger_accounts(id),
  entry_type      ledger_entry_type NOT NULL,
  amount          NUMERIC(14, 2) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT positive_entry_amount CHECK (amount > 0)
);

CREATE INDEX idx_ledger_entries_tx ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_account ON ledger_entries(account_id);
CREATE INDEX idx_ledger_entries_created ON ledger_entries(created_at);

-- View: account balances (calculated, not stored)
CREATE OR REPLACE VIEW account_balances AS
SELECT
  la.id AS account_id,
  la.name,
  la.account_type,
  la.currency,
  la.owner_id,
  la.project_id,
  COALESCE(SUM(CASE WHEN le.entry_type = 'debit' THEN le.amount ELSE 0 END), 0) AS total_debits,
  COALESCE(SUM(CASE WHEN le.entry_type = 'credit' THEN le.amount ELSE 0 END), 0) AS total_credits,
  COALESCE(SUM(CASE WHEN le.entry_type = 'credit' THEN le.amount ELSE 0 END), 0)
  - COALESCE(SUM(CASE WHEN le.entry_type = 'debit' THEN le.amount ELSE 0 END), 0) AS balance
FROM ledger_accounts la
LEFT JOIN ledger_entries le ON le.account_id = la.id
GROUP BY la.id, la.name, la.account_type, la.currency, la.owner_id, la.project_id;

-- ---------------------------------------------------------------------------
-- 6. DOCUMENTS
-- ---------------------------------------------------------------------------

CREATE TABLE documents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID REFERENCES projects(id),
  investment_id   UUID REFERENCES investments(id),
  uploaded_by     UUID NOT NULL REFERENCES profiles(id),

  category        document_category NOT NULL,
  title           TEXT NOT NULL,
  description     TEXT,
  file_path       TEXT NOT NULL,            -- Supabase Storage path
  file_name       TEXT NOT NULL,
  file_size       BIGINT,                   -- bytes
  mime_type       TEXT,
  version         INTEGER NOT NULL DEFAULT 1,

  -- access control
  is_public       BOOLEAN NOT NULL DEFAULT FALSE,  -- visible before investment
  investor_only   BOOLEAN NOT NULL DEFAULT TRUE,    -- visible only to project investors

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_investment ON documents(investment_id);
CREATE INDEX idx_documents_category ON documents(category);

-- ---------------------------------------------------------------------------
-- 7. PROJECT MILESTONES & PROGRESS
-- ---------------------------------------------------------------------------

CREATE TABLE milestones (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES projects(id),

  title_bg        TEXT NOT NULL,
  title_en        TEXT NOT NULL,
  description_bg  TEXT,
  description_en  TEXT,
  status          milestone_status NOT NULL DEFAULT 'planned',
  sort_order      INTEGER NOT NULL DEFAULT 0,

  planned_date    DATE,
  actual_date     DATE,

  -- budget tracking for this milestone
  planned_cost    NUMERIC(14, 2),
  actual_cost     NUMERIC(14, 2),

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_milestones_project ON milestones(project_id);
CREATE INDEX idx_milestones_status ON milestones(status);

-- Progress updates (photos, videos, reports)
CREATE TABLE progress_updates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  milestone_id    UUID REFERENCES milestones(id),
  author_id       UUID NOT NULL REFERENCES profiles(id),

  title_bg        TEXT NOT NULL,
  title_en        TEXT NOT NULL,
  content_bg      TEXT,                     -- markdown
  content_en      TEXT,                     -- markdown

  -- media
  images          TEXT[] DEFAULT '{}',      -- storage paths
  videos          TEXT[] DEFAULT '{}',      -- storage paths or URLs

  -- plan vs actual highlight
  budget_status   TEXT CHECK (budget_status IN ('on_track', 'over_budget', 'under_budget')),
  timeline_status TEXT CHECK (timeline_status IN ('on_track', 'delayed', 'ahead')),

  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_progress_project ON progress_updates(project_id);
CREATE INDEX idx_progress_published ON progress_updates(is_published, published_at);

-- ---------------------------------------------------------------------------
-- 8. DISTRIBUTIONS (return payments to investors)
-- ---------------------------------------------------------------------------

CREATE TABLE distributions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  investment_id   UUID NOT NULL REFERENCES investments(id),
  investor_id     UUID NOT NULL REFERENCES profiles(id),

  type            TEXT NOT NULL CHECK (type IN ('dividend', 'interest', 'capital_return', 'exit_proceeds')),
  gross_amount    NUMERIC(14, 2) NOT NULL,
  platform_fee    NUMERIC(14, 2) NOT NULL DEFAULT 0.00,
  net_amount      NUMERIC(14, 2) NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'EUR',

  -- linked ledger transaction
  transaction_id  UUID REFERENCES ledger_transactions(id),

  -- payment
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  paid_at         TIMESTAMPTZ,

  description     TEXT,
  period_start    DATE,                     -- for periodic distributions
  period_end      DATE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_distributions_project ON distributions(project_id);
CREATE INDEX idx_distributions_investor ON distributions(investor_id);
CREATE INDEX idx_distributions_status ON distributions(status);

-- ---------------------------------------------------------------------------
-- 9. NOTIFICATIONS
-- ---------------------------------------------------------------------------

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id),
  channel         notification_channel NOT NULL DEFAULT 'in_app',

  title_bg        TEXT NOT NULL,
  title_en        TEXT NOT NULL,
  body_bg         TEXT,
  body_en         TEXT,

  -- linking
  link_type       TEXT,                     -- 'project', 'investment', 'distribution', etc.
  link_id         UUID,

  is_read         BOOLEAN NOT NULL DEFAULT FALSE,
  read_at         TIMESTAMPTZ,
  sent_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- ---------------------------------------------------------------------------
-- 10. FAVORITES / WATCHLIST
-- ---------------------------------------------------------------------------

CREATE TABLE favorites (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id),
  project_id      UUID NOT NULL REFERENCES projects(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(user_id, project_id)
);

-- ---------------------------------------------------------------------------
-- 11. PROJECT BUDGET ITEMS (CAPEX/OPEX tracking)
-- ---------------------------------------------------------------------------

CREATE TABLE budget_items (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  milestone_id    UUID REFERENCES milestones(id),

  category        TEXT NOT NULL CHECK (category IN (
    'acquisition', 'renovation', 'construction', 'legal', 'tax',
    'insurance', 'management', 'marketing', 'utilities', 'other'
  )),
  description     TEXT NOT NULL,
  planned_amount  NUMERIC(14, 2) NOT NULL,
  actual_amount   NUMERIC(14, 2),
  currency        TEXT NOT NULL DEFAULT 'EUR',

  vendor_name     TEXT,
  invoice_ref     TEXT,
  invoice_doc_id  UUID REFERENCES documents(id),

  status          TEXT NOT NULL DEFAULT 'planned' CHECK (status IN (
    'planned', 'approved', 'invoiced', 'paid', 'cancelled'
  )),
  approved_by     UUID REFERENCES profiles(id),
  approved_at     TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_budget_project ON budget_items(project_id);
CREATE INDEX idx_budget_category ON budget_items(category);

-- ---------------------------------------------------------------------------
-- 12. CONTRACTORS / VENDORS
-- ---------------------------------------------------------------------------

CREATE TABLE contractors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  company_reg_no  TEXT,
  contact_person  TEXT,
  email           TEXT,
  phone           TEXT,
  specialty       TEXT,                     -- 'construction', 'legal', 'valuation', etc.
  rating          INTEGER CHECK (rating BETWEEN 1 AND 5),
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Link contractors to projects
CREATE TABLE project_contractors (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id      UUID NOT NULL REFERENCES projects(id),
  contractor_id   UUID NOT NULL REFERENCES contractors(id),
  role            TEXT NOT NULL,            -- 'general_contractor', 'electrician', 'lawyer', etc.
  contract_amount NUMERIC(14, 2),
  contract_doc_id UUID REFERENCES documents(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(project_id, contractor_id, role)
);

-- ---------------------------------------------------------------------------
-- 13. AUDIT LOG (append-only, immutable)
-- ---------------------------------------------------------------------------

CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_name      TEXT NOT NULL,
  record_id       UUID NOT NULL,
  action          TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data        JSONB,
  new_data        JSONB,
  changed_by      UUID,                     -- auth.uid() at time of change
  changed_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address      INET
);

CREATE INDEX idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_changed_at ON audit_log(changed_at);
CREATE INDEX idx_audit_changed_by ON audit_log(changed_by);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_fn()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO audit_log (table_name, record_id, action, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO audit_log (table_name, record_id, action, old_data, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', to_jsonb(OLD), auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit triggers to critical tables
CREATE TRIGGER audit_investments
  AFTER INSERT OR UPDATE OR DELETE ON investments
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_ledger_transactions
  AFTER INSERT ON ledger_transactions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_ledger_entries
  AFTER INSERT ON ledger_entries
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_distributions
  AFTER INSERT OR UPDATE ON distributions
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_projects
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_profiles
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

CREATE TRIGGER audit_budget_items
  AFTER INSERT OR UPDATE OR DELETE ON budget_items
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_fn();

-- ---------------------------------------------------------------------------
-- 14. UPDATED_AT TRIGGER (auto-update timestamp)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON progress_updates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON budget_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ---------------------------------------------------------------------------
-- 15. ROW LEVEL SECURITY POLICIES
-- ---------------------------------------------------------------------------

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- == PROFILES ==
-- Users can read their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT USING (id = auth.uid());

-- Admins can read all profiles
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Users can update their own profile
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admins can update any profile
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- == PROJECTS ==
-- Anyone authenticated can see published projects
CREATE POLICY "projects_select_published" ON projects
  FOR SELECT USING (
    status IN ('fundraising', 'funded', 'in_execution', 'exiting', 'completed')
  );

-- Admins and project owners can see all projects
CREATE POLICY "projects_select_admin" ON projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'project_owner'))
  );

-- Only admins can insert/update/delete projects
CREATE POLICY "projects_insert_admin" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'project_owner'))
  );

CREATE POLICY "projects_update_admin" ON projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'project_owner'))
  );

-- == INVESTMENTS ==
-- Investors can see their own investments
CREATE POLICY "investments_select_own" ON investments
  FOR SELECT USING (investor_id = auth.uid());

-- Admins can see all investments
CREATE POLICY "investments_select_admin" ON investments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Authenticated investors can create investments (with KYC check in app layer)
CREATE POLICY "investments_insert_investor" ON investments
  FOR INSERT WITH CHECK (investor_id = auth.uid());

-- Only admins can update investment status
CREATE POLICY "investments_update_admin" ON investments
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- == LEDGER ACCOUNTS ==
-- Investors see their own accounts
CREATE POLICY "ledger_accounts_select_own" ON ledger_accounts
  FOR SELECT USING (owner_id = auth.uid());

-- Admins see all
CREATE POLICY "ledger_accounts_select_admin" ON ledger_accounts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- == LEDGER TRANSACTIONS ==
-- Investors see transactions involving their accounts
CREATE POLICY "ledger_tx_select_own" ON ledger_transactions
  FOR SELECT USING (
    initiated_by = auth.uid()
    OR EXISTS (
      SELECT 1 FROM ledger_entries le
      JOIN ledger_accounts la ON la.id = le.account_id
      WHERE le.transaction_id = ledger_transactions.id
      AND la.owner_id = auth.uid()
    )
  );

-- Admins see all
CREATE POLICY "ledger_tx_select_admin" ON ledger_transactions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- == LEDGER ENTRIES ==
-- Investors see entries for their accounts
CREATE POLICY "ledger_entries_select_own" ON ledger_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM ledger_accounts
      WHERE id = ledger_entries.account_id
      AND owner_id = auth.uid()
    )
  );

-- Admins see all
CREATE POLICY "ledger_entries_select_admin" ON ledger_entries
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- == DOCUMENTS ==
-- Public documents visible to all authenticated users
CREATE POLICY "documents_select_public" ON documents
  FOR SELECT USING (is_public = TRUE);

-- Investor-only docs visible to investors in that project
CREATE POLICY "documents_select_investor" ON documents
  FOR SELECT USING (
    investor_only = TRUE
    AND EXISTS (
      SELECT 1 FROM investments
      WHERE investments.project_id = documents.project_id
      AND investments.investor_id = auth.uid()
      AND investments.status IN ('active', 'returning', 'exited')
    )
  );

-- Admins see all documents
CREATE POLICY "documents_select_admin" ON documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'project_owner'))
  );

-- Admins can manage documents
CREATE POLICY "documents_insert_admin" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'project_owner'))
  );

-- == MILESTONES ==
-- Visible for projects that are published
CREATE POLICY "milestones_select_published" ON milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = milestones.project_id
      AND projects.status IN ('fundraising', 'funded', 'in_execution', 'exiting', 'completed')
    )
  );

-- Admins can manage
CREATE POLICY "milestones_all_admin" ON milestones
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'project_owner'))
  );

-- == PROGRESS UPDATES ==
-- Published updates visible to authenticated users
CREATE POLICY "progress_select_published" ON progress_updates
  FOR SELECT USING (is_published = TRUE);

-- Admins can manage
CREATE POLICY "progress_all_admin" ON progress_updates
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'project_owner'))
  );

-- == DISTRIBUTIONS ==
-- Investors see their own
CREATE POLICY "distributions_select_own" ON distributions
  FOR SELECT USING (investor_id = auth.uid());

-- Admins see all
CREATE POLICY "distributions_select_admin" ON distributions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- == NOTIFICATIONS ==
-- Users see their own
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- == FAVORITES ==
CREATE POLICY "favorites_own" ON favorites
  FOR ALL USING (user_id = auth.uid());

-- == BUDGET ITEMS ==
-- Investors in a project can see budget items
CREATE POLICY "budget_select_investor" ON budget_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM investments
      WHERE investments.project_id = budget_items.project_id
      AND investments.investor_id = auth.uid()
      AND investments.status IN ('active', 'returning', 'exited')
    )
  );

-- Admins can manage
CREATE POLICY "budget_all_admin" ON budget_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'project_owner'))
  );

-- == CONTRACTORS ==
-- Admin only
CREATE POLICY "contractors_all_admin" ON contractors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "project_contractors_all_admin" ON project_contractors
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- == AUDIT LOG ==
-- Admin read-only
CREATE POLICY "audit_select_admin" ON audit_log
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ---------------------------------------------------------------------------
-- 16. HELPER FUNCTIONS
-- ---------------------------------------------------------------------------

-- Get investor's wallet balance
CREATE OR REPLACE FUNCTION get_wallet_balance(p_user_id UUID, p_currency TEXT DEFAULT 'EUR')
RETURNS NUMERIC AS $$
  SELECT COALESCE(balance, 0)
  FROM account_balances
  WHERE owner_id = p_user_id
  AND account_type = 'investor_wallet'
  AND currency = p_currency;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get investor's total invested amount
CREATE OR REPLACE FUNCTION get_invested_amount(p_user_id UUID, p_currency TEXT DEFAULT 'EUR')
RETURNS NUMERIC AS $$
  SELECT COALESCE(SUM(amount), 0)
  FROM investments
  WHERE investor_id = p_user_id
  AND status IN ('active', 'returning')
  AND currency = p_currency;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Get project funding progress
CREATE OR REPLACE FUNCTION get_project_funding(p_project_id UUID)
RETURNS TABLE (
  funded_amount NUMERIC,
  target_amount NUMERIC,
  investor_count BIGINT,
  progress_pct NUMERIC
) AS $$
  SELECT
    COALESCE(SUM(i.amount), 0) AS funded_amount,
    p.target_amount,
    COUNT(DISTINCT i.investor_id) AS investor_count,
    ROUND(COALESCE(SUM(i.amount), 0) / p.target_amount * 100, 2) AS progress_pct
  FROM projects p
  LEFT JOIN investments i ON i.project_id = p.id AND i.status IN ('active', 'returning')
  WHERE p.id = p_project_id
  GROUP BY p.target_amount;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Update project funding counters (called via trigger)
CREATE OR REPLACE FUNCTION update_project_funding()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects SET
    funded_amount = (
      SELECT COALESCE(SUM(amount), 0)
      FROM investments
      WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
      AND status IN ('active', 'returning')
    ),
    investor_count = (
      SELECT COUNT(DISTINCT investor_id)
      FROM investments
      WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
      AND status IN ('active', 'returning')
    )
  WHERE id = COALESCE(NEW.project_id, OLD.project_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_project_funding_on_investment
  AFTER INSERT OR UPDATE OR DELETE ON investments
  FOR EACH ROW EXECUTE FUNCTION update_project_funding();

-- ---------------------------------------------------------------------------
-- 17. SUPABASE STORAGE BUCKETS (created via Supabase dashboard or API)
-- ---------------------------------------------------------------------------
-- Buckets to create:
--   - 'project-images'    (public read, admin write)
--   - 'project-documents' (authenticated read with RLS, admin write)
--   - 'kyc-documents'     (private, owner + admin read, owner write)
--   - 'progress-media'    (authenticated read, admin write)
--   - 'avatars'           (public read, owner write)
