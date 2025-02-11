const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const { id, senderName, senderEmail, recipientEmail } = JSON.parse(event.body);

    // Setup Nodemailer transporter (Use your own credentials)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your Gmail App Password
      },
    });

    // Email Content
    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: recipientEmail,
      subject: "You've received a new message!",
      html: `
        <p>Hi,</p>
        <p>${senderName} has sent you a special message. Click the link below to view it:</p>
        <p><a href="https://your-app.netlify.app/message/${id}">Open Message</a></p>
        <p>Best regards,<br/>Your Message App</p>
      `,
    };

    // Send Email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email." }),
    };
  }
};
