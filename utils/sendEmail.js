const nodemailer = require("nodemailer");


const sendEmail = async ({ to, subject, message, html }) => {
  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 2525,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });
  let info = await transporter.sendMail({
    from: '"Tolani" <tolani@gmail.com>', // sender address
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;