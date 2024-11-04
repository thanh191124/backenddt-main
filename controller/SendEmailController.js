// Import the Nodemailer library
const nodemailer = require('nodemailer');
require('dotenv').config();
const EmailSend = process.env.EMAILSEND;
const PasswordSend = process.env.PASSWORDSEND;

// Create a reusable transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EmailSend,  // Replace with your Gmail address
    pass: PasswordSend,       // App password, not your regular Gmail password
  },
});

/**
 * Send an email using Nodemailer
 * @param {string} from - Sender's email address
 * @param {string} to - Recipient's email address
 * @param {string} subject - Subject of the email
 * @param {string} text - Body content of the email (plain text)
 * @param {function} callback - Callback to handle success or error
 */
const sendEmail = (from, to, subject, text, callback) => {
  const mailOptions = {
    from, // Sender email
    to,   // Recipient email
    subject, // Email subject
    text, // Plain text email body
  };

  // Send the email
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log('Error:', error);
      callback(error, null); // Handle the error in the callback
    } else {
      console.log('Email sent:', info.response);
      callback(null, info.response); // Handle the success in the callback
    }
  });
};

// Export the sendEmail function so it can be used in other files
module.exports = { sendEmail };
