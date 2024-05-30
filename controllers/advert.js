const { advert: Advert } = require("../models");
const {
  CustomError,
  BadRequest,
  UnauthenticatedError,
  UnAuthorizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createAdvert = async (req, res) => {
  req.body.user = req.user.userId;
  const promotion = await Advert.create({ ...req.body });
  res.status(StatusCodes.OK).json({ promotion });
};
const getAdvert = async (req, res) => {
  const advert = await Advert.findAll({});
  res.status(StatusCodes.OK).json({ advert });
};

const updateAdvert = async (req, res) => {
  const { id: advertId } = req.params;
  await Advert.update(req.body, {
    where: { _id: advertId },
    // returning: true,
    // plain: true,
  });
  const updatedAd = await Advert.findOne({ where: { _id: advertId } });

  res
    .status(StatusCodes.OK)
    .json({ msg: "Advert updated successfully", updatedAd });
};

module.exports = {
  getAdvert,
  createAdvert,
  updateAdvert,
};
