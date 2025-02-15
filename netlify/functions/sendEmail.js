const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const { recipientEmail, senderName, message, id } = JSON.parse(event.body);

    // Check for missing fields
    if (!recipientEmail || !senderName || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Create transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email options
    const mailOptions = {
      from: `"${senderName}" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `You’ve Received a Loving Message! from ${senderName} ❤️`,
      text: `You received a message from ${senderName}. Click the link to view YOUR loving message: https://crash0ut-mail-app.netlify.app/${id} 
If You want to write your own loving message visit: https://crash0ut-mail-app.netlify.app, all you need is their email address. ❤️`
    };
    

    // Send email
    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: "Email sent successfully!" }),
    };
  } catch (error) {
    console.error("Email sending error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send email" }),
    };
  }
};
