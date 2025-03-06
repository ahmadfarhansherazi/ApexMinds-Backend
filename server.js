const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async (to, subject, body, isHTML = false) => {
  try {
    console.log(`📧 Preparing to send email to: ${to}`);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // Your email app password
      },
      tls: {
        rejectUnauthorized: false, // Prevents SSL issues with some providers
      },
    });

    // Define email options
    const mailOptions = {
      from: `"ApexMinds AI" <${process.env.EMAIL_USER}>`, // Display name + sender email
      to,
      subject,
      [isHTML ? "html" : "text"]: body, // Use 'html' for HTML emails, 'text' for plain text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email successfully sent to ${to}:`, info.response);
    return true;
  } catch (error) {
    console.error("🔴 Error sending email:", {
      recipient: to,
      errorMessage: error.message,
    });
    return false;
  }
};

module.exports = sendEmail;
