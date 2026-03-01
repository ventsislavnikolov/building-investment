function fmt(n: number, currency = "EUR") {
	return new Intl.NumberFormat("en-EU", {
		style: "currency",
		currency,
		maximumFractionDigits: 0,
	}).format(n);
}

const baseStyle = `
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  max-width: 600px;
  margin: 0 auto;
  padding: 40px 20px;
  color: #151515;
`;

const buttonStyle = `
  display: inline-block;
  background: #1B59E8;
  color: #ffffff;
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
`;

export function renderInvestmentConfirmedEmail({
	amount,
	currency,
	projectTitle,
	investorName,
}: {
	amount: number;
	currency: string;
	projectTitle: string;
	investorName: string;
}): string {
	return `
<!DOCTYPE html>
<html>
<body style="${baseStyle}">
  <h1 style="color:#1B59E8;font-size:24px;margin-bottom:8px;">Investment Confirmed</h1>
  <p>Hi ${investorName},</p>
  <p>Your investment of <strong>${fmt(amount, currency)}</strong> in <strong>${projectTitle}</strong> has been confirmed.</p>
  <p>You can track your investment progress in your dashboard.</p>
  <br/>
  <a href="https://app.buildinginvestment.bg/dashboard" style="${buttonStyle}">Go to Dashboard</a>
  <br/><br/>
  <p style="color:#acb3ba;font-size:12px;">Building Investment Platform · Sofia, Bulgaria</p>
</body>
</html>`;
}

export function renderDistributionPaidEmail({
	amount,
	currency,
	projectTitle,
	investorName,
}: {
	amount: number;
	currency: string;
	projectTitle: string;
	investorName: string;
}): string {
	return `
<!DOCTYPE html>
<html>
<body style="${baseStyle}">
  <h1 style="color:#1B59E8;font-size:24px;margin-bottom:8px;">Distribution Received</h1>
  <p>Hi ${investorName},</p>
  <p>You have received a distribution of <strong>${fmt(amount, currency)}</strong> from <strong>${projectTitle}</strong>.</p>
  <p>The funds have been credited to your wallet.</p>
  <br/>
  <a href="https://app.buildinginvestment.bg/dashboard/wallet" style="${buttonStyle}">View Wallet</a>
  <br/><br/>
  <p style="color:#acb3ba;font-size:12px;">Building Investment Platform · Sofia, Bulgaria</p>
</body>
</html>`;
}

export function renderKycApprovedEmail({ name }: { name: string }): string {
	return `
<!DOCTYPE html>
<html>
<body style="${baseStyle}">
  <h1 style="color:#1B59E8;font-size:24px;margin-bottom:8px;">KYC Approved</h1>
  <p>Hi ${name},</p>
  <p>Your identity verification has been approved. You can now invest in projects on the platform.</p>
  <br/>
  <a href="https://app.buildinginvestment.bg/projects" style="${buttonStyle}">Browse Projects</a>
  <br/><br/>
  <p style="color:#acb3ba;font-size:12px;">Building Investment Platform · Sofia, Bulgaria</p>
</body>
</html>`;
}

export function renderWelcomeEmail({ name }: { name: string }): string {
	return `
<!DOCTYPE html>
<html>
<body style="${baseStyle}">
  <h1 style="color:#1B59E8;font-size:24px;margin-bottom:8px;">Welcome to Building Investment</h1>
  <p>Hi ${name},</p>
  <p>Welcome to Bulgaria's leading real estate investment platform.</p>
  <p>Browse curated projects and start investing with as little as €500.</p>
  <br/>
  <a href="https://app.buildinginvestment.bg/projects" style="${buttonStyle}">Explore Projects</a>
  <br/><br/>
  <p style="color:#acb3ba;font-size:12px;">Building Investment Platform · Sofia, Bulgaria</p>
</body>
</html>`;
}
