
import "dotenv/config";
import nodemailer from "nodemailer";

const clean = (name) => (process.env[name] ?? "").trim().replace(/^["']|["']$/g, "");

const host = clean("SMTP_HOST") || "smtp.gmail.com";
const port = Number(clean("SMTP_PORT") || 465);
const user = clean("SMTP_USER");
const pass = clean("SMTP_PASS").replace(/\s+/g, "");

if (!user || !pass) {
  console.error("SMTP_USER and SMTP_PASS are not both set. Copy mentorship/env.example to .env.local.");
  process.exit(1);
}

console.log(`host       ${host}:${port} (${port === 465 ? "TLS" : "STARTTLS"})`);
console.log(`user       ${user}`);
console.log(`password   ${pass.length} characters after removing spaces (Google issues 16)`);

const transport = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: { user, pass },
  connectionTimeout: 15_000,
});

try {
  await transport.verify();
  console.log("\nLogin accepted.");
} catch (error) {
  console.error(`\nLogin refused: ${error.message}`);
  if (error.responseCode === 535 || error.code === "EAUTH") {
    console.error(
      "\nSMTP_PASS must be a current 16-character App Password for this exact account:\n" +
        "  1. Sign in to " + user + " at https://myaccount.google.com\n" +
        "  2. Turn on 2-Step Verification\n" +
        "  3. Create one at https://myaccount.google.com/apppasswords\n" +
        "  4. Paste it into SMTP_PASS and run this again",
    );
  }
  process.exit(1);
}

const to = process.argv[2];
if (to) {
  const info = await transport.sendMail({
    from: `"${clean("MAIL_FROM_NAME") || "Mentorship Feedback Channel"}" <${user}>`,
    to,
    subject: "Mentorship Feedback Channel — SMTP test",
    text: "If you are reading this, the forms can send mail.",
  });
  console.log(`Test message sent to ${to} (${info.messageId})`);
}
