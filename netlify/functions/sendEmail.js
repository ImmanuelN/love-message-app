import nodemailer from "nodemailer";

export const handler = async (event) => {
  try {
    const { recipientEmail, senderName, messageId } = JSON.parse(event.body);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "crash0ut.inc.na@gmail.com",
        pass: "Immanuel_6",
      },
    });

    const mailOptions = {
      from: "crash0ut.inc.na@gmail.com",
      to: recipientEmail,
      subject: `You've received a message from ${senderName}`,
      html: `<p>${senderName} has sent you a message. Click <a href="https://your-app.netlify.app/${messageId}">here</a> to view it.</p>`,
    };

    await transporter.sendMail(mailOptions);
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
