const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");

class badRequstError extends CustomError {
  constructor(message) {
    super(message);
    this.statusCodes = StatusCodes.BAD_REQUEST;
  }
}

module.exports = badRequstError;
