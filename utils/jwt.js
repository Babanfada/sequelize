const jwt = require("jsonwebtoken");
const createTokenUser = (user) => {
  return {
    userId: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
    gender: user.gender,
    phone: user.phone,
    image: user.image,
    address: user.address,
  };
};

const createToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET);
};
const isValid = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const attachCookiesToResponse = ({ res, tokenUser, refreshToken }) => {
  const accessTokenJWT = createToken({ tokenUser });
  const refreshTokenJWT = createToken({ tokenUser, refreshToken });
  const oneDay = 1000 * 60 * 60 * 24;
  const twoWeeks = 1000 * 60 * 60 * 24 * 14;
  // console.log(accessTokenJWT,refreshTokenJWT)
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: "None",
    // secure: process.env.NODE_ENV === "production",
    signed: true,
    secure: true,
  });
  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + twoWeeks),
    sameSite: "None",
    // secure: process.env.NODE_ENV === "production",
    signed: true,
    secure: true,
  });
};

module.exports = { createTokenUser, attachCookiesToResponse, isValid };
