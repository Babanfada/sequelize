const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");
class NotFoundError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = NotFoundError;
