const sendEmail = require("./sendEmail");

const sendPassswordResetEmail = async ({
  origin,
  email,
  passwordToken,
  fullname,
}) => {
  const resetPassword = `${origin}/user/reset-password?token=${passwordToken}&email=${email}`;
  const emailBody = `Dear ${fullname} reset your password by clicking this link ${resetPassword}`;
  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: emailBody,
  });
};

module.exports = sendPassswordResetEmail;
