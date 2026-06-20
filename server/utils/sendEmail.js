const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"P2P Learning Platform" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Password Reset</h2>
          <p>${options.message}</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

  } catch (error) {
    console.error("Nodemailer Error:", error);
    throw new Error("Email sending failed");
  }
};

module.exports = sendEmail;
