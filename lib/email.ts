import nodemailer from "nodemailer";

export async function sendOrderNotification(
  email: string,
  tradeName: string,
  orderId: string,
  stage: string
) {
  // Use environment variables for SMTP config
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  // Skip email if SMTP not configured
  if (!smtpHost || !smtpUser || !smtpPass) {
    console.log(
      "Email not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local"
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const mailOptions = {
    from: smtpFrom,
    to: email,
    subject: `Order Confirmation - ${orderId} | LIC Print Shop`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Order Confirmed!</h1>
        <p>Dear <strong>${tradeName}</strong>,</p>
        <p>Your printing order has been successfully received and registered.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0;">Order Details</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Current Stage:</strong> ${stage}</p>
        </div>

        <p>You can track your order anytime by visiting our order tracking page and entering your order ID.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from LIC Print Shop. Please do not reply to this email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't throw - email failure shouldn't block order creation
  }
}
