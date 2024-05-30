const CustomError = require("./CustomError");
const BadRequest = require("./badRequest");
const UnauthenticatedError = require("./unauthenticated");
const UnAuthorizedError = require("./unauthorized");
const NotFoundError = require("./notFound");

module.exports = {
  NotFoundError,
  CustomError,
  BadRequest,
  UnauthenticatedError,
  UnAuthorizedError,
};
