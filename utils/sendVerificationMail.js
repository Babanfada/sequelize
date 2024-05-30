const sendEmail = require("./sendEmail");

const sendverificationEmail = async ({
  origin,
  email,
  verificationString,
  fullname,
}) => {
  const verifyEmail = `${origin}/user/verify-email?token=${verificationString}&email=${email}`;
  console.log(verifyEmail);
  const emailBody = `Dear ${fullname} verify your Email by clicking this link ${verifyEmail}`;
  return sendEmail({
    to: email,
    subject: "Email Verification",
    html: emailBody,
  });
};

module.exports = sendverificationEmail;
