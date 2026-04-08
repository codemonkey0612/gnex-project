// Email sending utility
// TODO: Replace with actual SMTP implementation (nodemailer, Resend, etc.)

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  // In development, log emails to console
  if (process.env.NODE_ENV !== "production") {
    console.log("\n📧 [DEV EMAIL]");
    console.log(`  To: ${params.to}`);
    console.log(`  Subject: ${params.subject}`);
    console.log(`  Body: ${params.html}\n`);
    return;
  }

  // Production: implement actual email sending
  // Example with nodemailer:
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: Number(process.env.SMTP_PORT),
  //   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  // });
  // await transporter.sendMail({ from: process.env.EMAIL_FROM, ...params });

  throw new Error("Email sending not configured for production");
}

export function buildVerificationEmail(
  email: string,
  token: string,
): SendEmailParams {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  return {
    to: email,
    subject: "【G-NEX】メールアドレスの確認",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F3864;">G-NEX メールアドレス確認</h2>
        <p>G-NEXへのご登録ありがとうございます。</p>
        <p>以下のリンクをクリックして、メールアドレスを確認してください：</p>
        <a href="${verifyUrl}"
           style="display: inline-block; background: #1F3864; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; margin: 16px 0;">
          メールアドレスを確認する
        </a>
        <p style="color: #666; font-size: 14px;">
          このリンクは24時間有効です。<br>
          心当たりがない場合は、このメールを無視してください。
        </p>
      </div>
    `,
  };
}

export function buildPasswordResetEmail(
  email: string,
  token: string,
): SendEmailParams {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${baseUrl}/reset-password?token=${token}`;

  return {
    to: email,
    subject: "【G-NEX】パスワードの再設定",
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F3864;">G-NEX パスワード再設定</h2>
        <p>パスワード再設定のリクエストを受け付けました。</p>
        <p>以下のリンクをクリックして、新しいパスワードを設定してください：</p>
        <a href="${resetUrl}"
           style="display: inline-block; background: #1F3864; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; margin: 16px 0;">
          パスワードを再設定する
        </a>
        <p style="color: #666; font-size: 14px;">
          このリンクは1時間有効です。<br>
          心当たりがない場合は、このメールを無視してください。
        </p>
      </div>
    `,
  };
}

export function buildAdminNewContractorEmail(params: {
  companyName: string;
  contactName: string;
  email: string;
  role: "CONTRACTOR" | "LEAD_BUYER";
}): SendEmailParams {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const adminUrl = `${baseUrl}/dashboard/admin`;
  const roleLabel = params.role === "CONTRACTOR" ? "受注者" : "リード購入パートナー";

  return {
    to: process.env.ADMIN_EMAIL || "admin@gnex.jp",
    subject: `【G-NEX】新規${roleLabel}の承認依頼`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1F3864;">新規${roleLabel}の登録通知</h2>
        <p>新しい${roleLabel}アカウントがメール認証を完了し、承認待ちです。</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">企業名</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${params.companyName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">担当者名</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${params.contactName}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">メール</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${params.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9; font-weight: bold;">種別</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${roleLabel}</td>
          </tr>
        </table>
        <a href="${adminUrl}"
           style="display: inline-block; background: #1F3864; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; margin: 16px 0;">
          管理画面で確認する
        </a>
      </div>
    `,
  };
}
