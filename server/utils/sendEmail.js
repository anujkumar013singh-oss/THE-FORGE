const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendOTPEmail = async (to, otp) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background-color:#0A0A0A;font-family:sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding:40px 20px;">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#111;border-radius:12px;border:1px solid rgba(225,6,0,0.2);">
            <tr><td align="center" style="padding:40px 40px 20px;">
              <h1 style="font-family:'Space Grotesk',sans-serif;font-size:28px;color:#fff;letter-spacing:2px;margin:0;">
                THE <span style="color:#E10600;">FORGE</span>
              </h1>
              <p style="color:#C9C9C9;font-size:14px;margin:8px 0 0;">Your OTP Code</p>
            </td></tr>
            <tr><td align="center" style="padding:20px 40px;">
              <div style="background:#0A0A0A;border-radius:8px;padding:24px 32px;border:1px solid rgba(255,255,255,0.05);">
                <p style="color:#fff;font-size:36px;font-weight:700;letter-spacing:8px;margin:0;font-family:'Space Grotesk',sans-serif;">
                  ${otp}
                </p>
              </div>
              <p style="color:#A0A0A0;font-size:13px;margin:16px 0 0;line-height:1.5;">
                This code expires in <strong style="color:#fff;">10 minutes</strong>. If you didn't request this, you can safely ignore this email.
              </p>
            </td></tr>
            <tr><td align="center" style="padding:20px 40px 40px;">
              <p style="color:#555;font-size:11px;margin:0;">
                &copy; ${new Date().getFullYear()} THE FORGE. All rights reserved.
              </p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `;

  return transporter.sendMail({
    from: process.env.SMTP_FROM || '"THE FORGE" <noreply@theforge.in>',
    to,
    subject: "Your THE FORGE OTP Code",
    html
  });
};

module.exports = { sendOTPEmail, transporter };
