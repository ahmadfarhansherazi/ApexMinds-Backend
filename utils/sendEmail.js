const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, body, isHTML = false) => {
  console.log(`📧 sendEmail function called for: ${to}`);

  // Check for missing email credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error("🔴 Missing email configuration:", {
      hasEmailUser: !!process.env.EMAIL_USER,
      hasEmailPass: !!process.env.EMAIL_PASS
    });
    return false;
  }

  try {
    // Validate recipient email
    if (!to || !to.includes("@")) {
      console.error("🔴 Invalid recipient email:", to);
      return false;
    }

    console.log("📧 Creating email transporter...");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // Helps with some email providers blocking connections
      }
    });

    // Email options
    const mailOptions = {
      from: `"ApexMinds AI" <${process.env.EMAIL_USER}>`, // Change "ApexMinds AI" to your company name
      to,
      subject,
      [isHTML ? "html" : "text"]: body, // Properly handle HTML vs plain text emails
    };

    console.log(`📧 Sending email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent successfully!", {
      messageId: info.messageId,
      response: info.response
    });

    return true;
  } catch (error) {
    console.error("🔴 Email sending failed!", {
      recipient: to,
      errorName: error.name,
      errorMessage: error.message,
      errorCode: error.code,
      errorResponse: error.response
    });
    return false;
  }
};

module.exports = sendEmail;
