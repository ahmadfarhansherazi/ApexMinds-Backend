const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// Handle form submission
const submitContactForm = async (req, res) => {
  try {
    console.log('\n=== START FORM SUBMISSION ===');
    console.log('Received form data:', req.body);
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      console.log('❌ Validation failed - Missing fields:', { name, email, message });
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save to database
    console.log('💾 Saving to database...');
    const newContact = new Contact({ name, email, message });
    const savedContact = await newContact.save();
    console.log('✅ Database save successful');

    // Send email to admin
    console.log('\n--- Starting Admin Email ---');
    const adminEmailSent = await sendEmail(
      process.env.ADMIN_EMAIL,
      "New Contact Form Submission",
      `You received a new message from:
      \nName: ${name}
      \nEmail: ${email}
      \nMessage: ${message}`
    );
    console.log('Admin email result:', adminEmailSent ? '✅ Success' : '❌ Failed');

    // Send confirmation email to user
    console.log('\n--- Starting User Email ---');
    console.log('📧 Preparing to send confirmation to:', email);
    
    try {
      console.log('📧 Attempting user email send...');
      const userEmailSent = await sendEmail(
        email,
        "Thank You for Contacting ApexMinds AI",
        `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                background: #007BFF;
                color: #fff;
                padding: 10px;
                text-align: center;
                font-size: 24px;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
              }
              .content {
                padding: 20px;
              }
              .footer {
                font-size: 12px;
                color: #777;
                text-align: center;
                padding: 10px;
                border-top: 1px solid #ddd;
              }
              .highlight {
                color: #007BFF;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                Thank You for Contacting ApexMinds AI
              </div>
              <div class="content">
                <p>Dear <span class="highlight">${name}</span>,</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <p><strong>Your Message:</strong></p>
                <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; font-style: italic; color: #555;">
                  ${message}
                </blockquote>
                <p>If you need urgent assistance, please feel free to reach out to us directly.</p>
                <p>Best regards,<br><strong>ApexMinds AI Team</strong></p>
              </div>
              <div class="footer">
                &copy; ${new Date().getFullYear()} ApexMinds AI. All rights reserved.
              </div>
            </div>
          </body>
        </html>
        `,
        true // Pass true to indicate it's an HTML email
      );
    } catch (error) {
      console.error("🔴 Error sending user email:", error);
    }
    

    console.log('=== END FORM SUBMISSION ===\n');
    res.status(201).json({ 
      message: "Message received successfully!", 
      adminEmailSent,
      savedToDb: true
    });
    
  } catch (error) {
    console.error("❌ Main process error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { submitContactForm };
