const nodemailer = require("nodemailer");

exports.email = async (data) => {
  try {
    const transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: '"HalalExpress" <halalexpress960@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    };

    if (data.attachment) {
      mailOptions.attachments = [
        {
          filename: data.attachment.originalname,
          path: data.attachment.path,
        },
      ];
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
