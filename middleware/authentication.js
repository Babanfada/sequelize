const { isValid, attachCookiesToResponse } = require("../utils/jwt");
const db = require("../models");
const { token } = db;
const { UnauthenticatedError, UnAuthorizedError } = require("../errors");

const authenticated = async (req, res, next) => {
  const { accessToken, refreshToken: refreshedToken } = req.signedCookies;
  try {
    if (accessToken) {
      const { tokenUser } = isValid(accessToken);
      // console.log(tokenUser);
      req.user = tokenUser;
      return next();
    }

    const { tokenUser, refreshToken } = isValid(refreshedToken);
    // console.log(tokenUser, refreshToken);

    const existingToken = await token.findOne({
      where: {
        user: tokenUser.userId,
        refreshToken: refreshToken,
      },
    });

    const isValidToken = existingToken?.isValid;
    if (!isValidToken || !existingToken) {
      throw new UnauthenticatedError("Token is not valid");
    }
    req.user = tokenUser;
    attachCookiesToResponse({ tokenUser, res, refreshToken });
    next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication invalid, there is no token");
  }
};

const authorizedPermissions = (...roles) => {
  const authorize = (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnAuthorizedError("Not authorized to access this route");
    }
    next();
  };
  return authorize;
};
module.exports = { authenticated, authorizedPermissions };
