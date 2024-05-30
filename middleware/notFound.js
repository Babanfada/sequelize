const { StatusCodes } = require("http-status-codes");
const notFound = async (req, res) => {
  res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "This Route is not available" });
};

module.exports = notFound;
