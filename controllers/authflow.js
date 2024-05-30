const { StatusCodes } = require("http-status-codes");
const db = require("../models");
const { users, token } = db;
// has to be in this order as in each schema has to be accessed by importing the db first;
const {
  BadRequest,
  UnauthenticatedError,
  UnAuthorizedError,
} = require("../errors");
const crypto = require("crypto");
const sendverificationEmail = require("../utils/sendVerificationMail");
const { createTokenUser, attachCookiesToResponse } = require("../utils/jwt");
const sendPassswordResetEmail = require("../utils/sendPasswordResetEmail");
const register = async (req, res) => {
  const {
    fullname,
    email,
    password,
    address,
    phone,
    gender,
    emailNotification,
  } = req.body;
  const emailAlreadyExist = await users.findOne({ where: { email } });

  if (emailAlreadyExist) {
    throw new BadRequest("you have registered already!!!!");
  }
  //create first account
  const isFirstAccount = await users.count();
  // console.log(isFirstAccount);
  const role = isFirstAccount === 0 ? "admin" : "user";
  //   create verification token
  const verificationString = crypto.randomBytes(40).toString("hex");
  // console.log(verificationString);
  //   create user
  const userObject = {
    fullname,
    email,
    password,
    phone,
    gender,
    address,
    role,
    verificationString,
    emailNotification,
  };
  const user = await users.create(userObject);
  const origin = "http://localhost:5006";
  // verify Email
  await sendverificationEmail({
    origin,
    email: user.email,
    verificationString: user.verificationString,
    fullname: user.fullname,
  });

  res.status(StatusCodes.CREATED).json({
    user: userObject,
    msg: "We have sent you a verification mail to conclude the registeration",
  });
};

const verifyEmail = async (req, res) => {
  const { verificationString, email } = req.body;
  const user = await users.findOne({ where: { email } });
  if (!user) {
    throw new BadRequest("verification failed !!!");
  }
  if (verificationString !== user.verificationString) {
    throw new BadRequest("verification failed !!!! ");
  }
  user.verificationString = "";
  user.verified = Date.now();
  user.isVerified = true;
  await user.save();
  res.status(StatusCodes.OK).json({
    msg: "Verification successful",
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest("you need to provide both email and password");
  }
  const user = await users.findOne({ where: { email } });
  if (!user) {
    throw new BadRequest("Authentication invalid, User not Registered");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(
      "Authentication invalid, Password is not correct"
    );
  }
  const isVerified = user.isVerified;
  if (!isVerified) {
    throw new UnauthenticatedError(
      "Authentication invalid, user has not verified email, please verify first!!!"
    );
  }
  const isBlackListed = user.blackListed;
  if (isBlackListed) {
    throw new UnAuthorizedError(
      "You have been BANNED from accessing this Route sorry !!!!!"
    );
  }
  const tokenUser = createTokenUser(user);
  // console.log(tokenUser)
  // //   refresh token
  let refreshToken = "";
  const existingToken = await token.findOne({ where: { user: user._id } });
  if (existingToken) {
    const isValid = existingToken.isValid;
    if (!isValid) {
      throw new UnauthenticatedError("Authentication invalid, invalid token");
    }
    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ tokenUser, res, refreshToken });
    res.status(StatusCodes.OK).json({
      msg: "login successful",
    });
    return;
  }
  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  await token.create({ refreshToken, userAgent, ip, user: user._id });
  attachCookiesToResponse({ tokenUser, res, refreshToken });
  res.status(StatusCodes.OK).json({
    msg: "login successful",
  });
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new UnauthenticatedError("Authentication invalid, user not found");
  }
  const user = await users.findOne({ where: { email } });
  // console.log(user);
  if (!user) {
    throw new UnauthenticatedError("Reset Password Failed");
  }
  const passwordToken = crypto.randomBytes(40).toString("hex");
  const tenMin = 1000 * 60 * 10;
  user.passwordToken = passwordToken;
  user.passwordExpirationDate = new Date(Date.now() + tenMin);
  await user.save();
  const origin = "http://localhost:5006"; //mark
  //   send password reset email
  await sendPassswordResetEmail({
    origin,
    email: user.email,
    passwordToken: user.passwordToken,
    fullname: user.fullname,
  });
  res.status(StatusCodes.OK).json({ msg: "Check Email to Reset password" });
};
const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  if (!email || !token || !password) {
    throw new BadRequest("Please provide all fields");
  }
  const user = await users.findOne({ where: { email } });
  // console.log(user.passwordExpirationDate);
  if (!user) {
    throw new UnauthenticatedError("Reset Password Failed, user not found");
  }
  const now = new Date();
  if (user.passwordToken === token && now < user.passwordExpirationDate) {
    user.password = password;
    user.passwordToken = null;
    user.passwordExpirationDate = null;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "Password Reset successfully" });
  }
  throw new UnauthenticatedError("Password reset failed");
};

const checkUserRegisterationStatus = async (req, res) => {
  const { email } = req.body;
  const user = await users.findOne({ where: { email } });
  if (!user) {
    res.status(StatusCodes.OK).json({ msg: "notfound" });
  }
  res.status(StatusCodes.OK).json({ msg: "found" });
};
const blackListUser = async (req, res) => {
  const { id: userId } = req.params;
  const { blacklist, isValid } = req.body;
  const user = await users.findOne({ where: { _id: userId } });
  if (!user) {
    throw new BadRequest("user not found");
  }
  const userToken = await token.findOne({ where: { user: userId } });
  user.blackListed = blacklist;
  user.save();
  userToken.isValid = isValid;
  userToken.save();
  if (user.blackListed === false && userToken.isValid === true) {
    res.status(StatusCodes.OK).json({
      msg: `${user.fullname} has been Activated`,
    });
    return;
  }
  res.status(StatusCodes.OK).json({
    msg: `${user.fullname} has been De-activated`,
  });
};

const logout = async (req, res) => {
  // console.log(req.user);
  await token.destroy({ where: { user: req.user.userId } });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
    secure: true,
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
    sameSite: "None",
    secure: true,
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};
const showMe = async (req, res) => {
  const { userId, fullname, email, role } = req.user;
  res.status(StatusCodes.OK).json({ userId, fullname, email, role });
};
module.exports = {
  login,
  register,
  logout,
  verifyEmail,
  forgetPassword,
  resetPassword,
  checkUserRegisterationStatus,
  blackListUser,
  showMe,
};
