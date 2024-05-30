const { promotion: Promotion } = require("../models");
const {
  BadRequest,
  NotFoundError,
  UnauthenticatedError,
  UnAuthorizedError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;

const createPromotion = async (req, res) => {
  req.body.user = req.user.userId;
  const promotion = await Promotion.create({ ...req.body });
  res.status(StatusCodes.OK).json({ promotion });
};
const getAllPromotion = async (req, res) => {
  const promotion = await Promotion.findAll({});
  res.status(StatusCodes.OK).json({ promotion, count: promotion.length });
};
const getSinglePromotion = async (req, res) => {
  const { id: prom } = req.params;
  const promotion = await Promotion.findOne({ where: { _id: prom } });
  if (!promotion) {
    throw new NotFoundError(`There is no promotion with the is ${prom}`);
  }
  res.status(StatusCodes.OK).json({ promotion });
};

const promotionImage = async (req, res) => {
  const promImage = req.files.image;
  console.log(promImage);
  if (!promImage.mimetype.startsWith("image")) {
    throw new BadRequest("please upload image");
  }
  const maxSize = 2000 * 3000;
  if (promImage.size > maxSize) {
    throw new BadRequest("uploaded files should not be more than 18mb");
  }
  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "promotions",
    }
  );
  console.log(result);
  res.status(StatusCodes.OK).json({
    image: {
      src: result.secure_url,
    },
  });
  fs.unlinkSync(req.files.image.tempFilePath);
};
const updatePromotion = async (req, res) => {
  const { id: promId } = req.params;
  const beforeUpdate = await Promotion.findOne({ where: { _id: promId } });
  if (!beforeUpdate) {
    throw new NotFoundError(`There is no promotion with the is ${promId}`);
  }
  await Promotion.update(req.body, { where: { _id: promId } });
  const afterUpdate = await Promotion.findOne({ where: { _id: promId } });
  res
    .status(StatusCodes.OK)
    .json({ prom: afterUpdate, msg: "Promotion updated successfully" });
};
const removePromotion = async (req, res) => {
  const { id: promId } = req.params;
  const promotion = await Promotion.findOne({ where: { _id: promId } });
  if (!promotion) {
    throw new NotFoundError(`There is no promotion with the is ${promId}`);
  }
  await promotion.destroy({ where: { _id: promId } }); //remove is deprecated
  res.status(StatusCodes.OK).json({
    msg: `promotion with the id of ${promId} has been deleted successfully`,
  });
};

module.exports = {
  getAllPromotion,
  getSinglePromotion,
  createPromotion,
  promotionImage,
  updatePromotion,
  removePromotion,
};
