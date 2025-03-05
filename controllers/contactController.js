const Contact = require("../models/Contact");
const sendEmail = require("../utils/sendEmail");

// Handle form submission
const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save the contact message to MongoDB
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Send confirmation email to admin
    await sendEmail(
      process.env.ADMIN_EMAIL, // Admin's email
      "New Contact Form Submission",
      `You received a new message from:
      \nName: ${name}
      \nEmail: ${email}
      \nMessage: ${message}`
    );

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error handling contact form:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

module.exports = { submitContactForm };
