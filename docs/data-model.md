# Data Model - Building Investment Platform

## Entity Relationship Overview

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│  auth.users  │────▶│   profiles   │◀────│ notifications│
└─────────────┘     └──────┬───────┘     └──────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
      ┌──────────┐  ┌───────────┐  ┌──────────┐
      │favorites │  │investments│  │ ledger   │
      └────┬─────┘  └─────┬─────┘  │ accounts │
           │              │        └─────┬────┘
           │              │              │
           ▼              ▼              ▼
      ┌──────────┐  ┌───────────┐  ┌──────────────┐
      │ projects │◀─┤distributions│ │ ledger       │
      └────┬─────┘  └───────────┘  │ transactions │
           │                        └──────┬───────┘
    ┌──────┼──────────┬──────┐             │
    │      │          │      │             ▼
    ▼      ▼          ▼      ▼       ┌───────────┐
┌────────┐┌─────┐┌────────┐┌─────┐  │ ledger    │
│mile-   ││docs ││budget  ││proj.│  │ entries   │
│stones  ││     ││items   ││contr│  └───────────┘
└───┬────┘└─────┘└────────┘└──┬──┘
    │                         │
    ▼                         ▼
┌──────────┐           ┌────────────┐
│progress  │           │contractors │
│updates   │           └────────────┘
└──────────┘
```

## Tables Summary

| # | Table | Purpose | Key Relations |
|---|-------|---------|---------------|
| 1 | `profiles` | User accounts (investors, admins, project owners) | extends auth.users |
| 2 | `projects` | Investment opportunities / SPVs | has many: investments, milestones, documents, budget_items |
| 3 | `investments` | Investor <-> Project link with amount and terms | belongs to: profile, project |
| 4 | `ledger_accounts` | Chart of accounts (wallets, SPV accounts, platform) | belongs to: profile or project |
| 5 | `ledger_transactions` | Transaction metadata (groups entries) | has many: ledger_entries |
| 6 | `ledger_entries` | Individual debits/credits (immutable) | belongs to: transaction, account |
| 7 | `documents` | Files: contracts, valuations, permits, KYC | belongs to: project or investment |
| 8 | `milestones` | Project timeline checkpoints | belongs to: project |
| 9 | `progress_updates` | Photos, videos, reports on project progress | belongs to: project, milestone |
| 10 | `distributions` | Return payments to investors | belongs to: project, investment, profile |
| 11 | `notifications` | In-app and email notifications | belongs to: profile |
| 12 | `favorites` | Investor watchlist | belongs to: profile, project |
| 13 | `budget_items` | CAPEX/OPEX line items per project | belongs to: project, milestone |
| 14 | `contractors` | Vendors/service providers | standalone |
| 15 | `project_contractors` | Contractor assignments to projects | belongs to: project, contractor |
| 16 | `audit_log` | Immutable change history | references any table |

## Roles & Access Matrix

| Resource | Investor | Project Owner | Admin |
|----------|----------|---------------|-------|
| Own profile | RW | RW | RW |
| All profiles | - | - | R |
| Published projects | R | R | R |
| Draft projects | - | RW | RW |
| Own investments | R | - | R |
| All investments | - | - | RW |
| Own wallet/ledger | R | - | R |
| All ledger data | - | - | R |
| Public documents | R | R | R |
| Investor-only docs | R (if invested) | R | R |
| Manage documents | - | W | RW |
| Milestones (published) | R | RW | RW |
| Progress updates | R (published) | RW | RW |
| Distributions (own) | R | - | RW |
| Budget items | R (if invested) | RW | RW |
| Contractors | - | - | RW |
| Audit log | - | - | R |

## Ledger Architecture (Double-Entry)

Every money movement creates a balanced transaction:

### Investor deposits money
```
Transaction: deposit, 1000 EUR
  CREDIT  investor_wallet (Ivan)     +1000
  DEBIT   platform_fees (holding)    +1000
```

### Investor invests in project
```
Transaction: investment, 1000 EUR
  DEBIT   investor_wallet (Ivan)     -1000
  CREDIT  investor_invested (Ivan)   +1000
  CREDIT  spv_escrow (Project A)     +1000
```

### Project distributes dividend
```
Transaction: return, 150 EUR
  DEBIT   spv_operating (Project A)  -150
  CREDIT  investor_wallet (Ivan)     +150
  DEBIT   investor_invested (Ivan)   -150 (partial)
```

### Platform collects fee
```
Transaction: fee_platform, 20 EUR
  DEBIT   spv_operating (Project A)  -20
  CREDIT  platform_revenue           +20
```

## Key Design Decisions

### 1. SPV isolation via project_id
- Every financial entity links to a specific project (SPV)
- Ledger accounts are per-investor AND per-project
- No fund mixing possible at the data layer

### 2. Immutable financial records
- `ledger_entries` and `ledger_transactions` are append-only
- Audit triggers log all changes
- Balances calculated from entries, never stored directly

### 3. Bilingual content
- All user-facing text has `_bg` and `_en` variants
- Application layer selects based on user's `locale` preference

### 4. JSONB for flexible configurations
- `waterfall_config`: fee structure varies per project
- `sensitivity_config`: scenario analysis varies per project
- `notification_preferences`: user settings

### 5. Calculated vs stored values
- `account_balances` is a VIEW (calculated)
- `projects.funded_amount` is denormalized (updated via trigger) for query performance
- Cap table percentages recalculated on investment changes

## Supabase Storage Buckets

| Bucket | Access | Content |
|--------|--------|---------|
| `project-images` | Public read | Cover photos, gallery |
| `project-documents` | RLS-controlled | Contracts, valuations, KIIS |
| `kyc-documents` | Private (owner + admin) | ID cards, proof of address |
| `progress-media` | Authenticated read | Construction photos/videos |
| `avatars` | Public read | User profile pictures |

## Stripe Connect Integration Points

| Entity | Stripe Object | Purpose |
|--------|---------------|---------|
| Profile (investor) | Customer | Payment source |
| Project (SPV) | Connected Account | Receives funds |
| Investment | PaymentIntent | Collects investment |
| Distribution | Transfer | Sends returns |
| Platform fee | Application Fee | Platform revenue |

## Indexes Strategy

- All foreign keys indexed
- Status columns indexed (frequent filtering)
- Date columns indexed (range queries)
- Composite indexes for common query patterns
- Unique constraints where business rules require
