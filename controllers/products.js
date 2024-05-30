const { products: PRODUCT, colors, reviews } = require("../models");
// const Sequelize = require("sequelize");
const { Op, Sequelize } = require("sequelize");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const he = require("he");
const {
  BadRequest,
  UnauthenticatedError: UnAuthenticated,
  NotFoundError: NotFound,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  checkPermissions,
  createTokenUser,
  attachCookiesToResponse,
} = require("../utils/jwt");

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await PRODUCT.create({ ...req.body });
  res.status(StatusCodes.OK).json({ product });
};

const getAllProducts = async (req, res) => {
  const {
    categoryA,
    categoryB,
    pages,
    sort,
    fields,
    name,
    freeShipping,
    color,
    featured,
    size,
    numberFilter,
  } = req.query;
  const queryObject = {};
  const totalProducts = await PRODUCT.count({ where: queryObject });
  if (name) {
    queryObject.name = {
      [Sequelize.Op.like]: Sequelize.fn("LOWER", `%${name.toLowerCase()}%`),
    };
  }
  if (categoryA) {
    queryObject.categoryA = categoryA;
  }
  if (categoryB) {
    queryObject.categoryB = categoryB;
  }
  if (freeShipping && freeShipping !== "select one") {
    queryObject.freeShipping =
      freeShipping === `available` ? "available" : "not available";
  }
  if (featured && featured !== "select one") {
    queryObject.featured =
      featured === `available` ? "available" : "not available";
  }
  if (size) {
    queryObject.size = size;
  }
  // if (color) {
  //   const colorFilter = {
  //     [Op.or]: [
  //       { "$colors.color0$": { [Op.like]: Sequelize.fn("LOWER", `%${color.toLowerCase()}%`) } },
  //       { "$colors.color1$": { [Op.like]: Sequelize.fn("LOWER", `%${color.toLowerCase()}%`) } },
  //       { "$colors.color2$": { [Op.like]: Sequelize.fn("LOWER", `%${color.toLowerCase()}%`) } },
  //       { "$colors.color3$": { [Op.like]: Sequelize.fn("LOWER", `%${color.toLowerCase()}%`) } },
  //       { "$colors.color4$": { [Op.like]: Sequelize.fn("LOWER", `%${color.toLowerCase()}%`) } },
  //       { "$colors.color5$": { [Op.like]: Sequelize.fn("LOWER", `%${color.toLowerCase()}%`) } },
  //     ],
  //   };

  //   queryObject[Op.and] = colorFilter;
  // }

  if (numberFilter) {
    const operatorMap = {
      ">": "gt",
      ">=": "gte",
      "=": "eq",
      "<": "lt",
      "<=": "lte",
    };
    const regEx = /(\b<=|>=|=|<|>|\b&lt;=|\b&gt;=|\b&lt;|\b&gt;|\b&le;)\b/g;
    let filter = numberFilter.replace(
      regEx,
      (match) => `-${operatorMap[match]}-`
    );
    const options = ["averageRating", "price"]; 
    filter.split(" ").forEach((item) => {
      const detail = item.split(",");
      const [LS, GT] = detail;
      const [field, operator, value] = LS.split("-");
      const [_, operator2, value2] = GT.split("-");
      console.log(field, value, value2);
      if (options.includes(field)) {
        queryObject[field] = {
          [Sequelize.Op[operator]]: Number(value),
          [Sequelize.Op[operator2]]: Number(value2),
        };
      }
    });
  }
  // console.log(queryObject);

  const page = Number(pages) || 1;
  const limit = Number(req.query.limit) || 6;
  const offset = (page - 1) * limit;
  const numOfPages = Math.ceil(totalProducts / limit);
  let sortList;
  switch (sort) {
    case "high-low":
      sortList = [["price", "DESC"]];
      break;
    case "low-high":
      sortList = [["price", "ASC"]];
      break;
    case "A-Z":
      sortList = [["name", "ASC"]];
      break;
    case "Z-A":
      sortList = [["name", "DESC"]];
      break;
    case "high-rating":
      sortList = [["averageRating", "DESC"]];
      break;
    case "low-rating":
      sortList = [["averageRating", "ASC"]];
      break;
    default:
      sortList = [["createdAt", "ASC"]];
      break;
  }
  const product = await PRODUCT.findAll({
    where: { ...queryObject },
    include: [
      {
        model: colors,
        required: false, // This makes the join a left outer join
        attributes: [
          "color0",
          "color1",
          "color2",
          "color3",
          "color4",
          "color5",
        ],
        // on: {
        //   "$products._id$": Sequelize.literal('"colors"."productId"'),
        // // this is optionals, sequelize is smart enough to infer this automatically
        // },
      },
      {
        model: reviews,
        required: false,
        attributes: ["rating", "title", "comment"],
      },
    ],
    attributes: fields ? fields.split(",") : undefined,
    order: sortList,
    limit,
    offset,
  });

  res.status(StatusCodes.OK).json({
    product,
    count: product.length,
    numOfPages,
    totalProducts,
  });
};

const getNumOfTimesSold = async (req, res) => {
  const product = await PRODUCT.findAll({
    attributes: ["name", "numOfTimesSold", "inventory"],
    limit: 10,
  });

  res.status(StatusCodes.OK).json({ product });
};

const getSingleProduct = async (req, res) => {
  const { id: prodId } = req.params;
  const product = await PRODUCT.findOne({
    where: { _id: prodId },
    include: [
      { model: colors, required: false },
      { model: reviews, required: false },
    ],
  });
  if (!product) {
    throw new NotFound(`There is no product with the is ${prodId}`);
  }
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const { id: prodId } = req.params;
  const beforeUpdate = await PRODUCT.findOne({ where: { _id: prodId } });
  if (!beforeUpdate) {
    throw new NotFound(`There is no product with the is ${prodId}`);
  }
  await PRODUCT.update(req.body, {
    where: { _id: prodId },
  });
  res.status(StatusCodes.OK).json({ msg: "Product updated successfully" });
};

const removeProduct = async (req, res) => {
  const { id: prodId } = req.params;
  const beforeDestroy = await PRODUCT.findOne({ where: { _id: prodId } });
  if (!beforeDestroy) {
    throw new NotFound(`There is no product with the is ${prodId}`);
  }
  await PRODUCT.destroy({ where: { _id: prodId } });
  res.status(StatusCodes.OK).json({
    msg: `product with the id of ${prodId} has been deleted successfully`,
  });
};
const uploadImages = async (req, res) => {
  const prodImages = Object.values(req.files);
  console.log(prodImages);
  const uploadPromises = prodImages.map(async (prodImage) => {
    if (!prodImage.mimetype.startsWith("image")) {
      throw new BadRequest("Please upload an image ");
    }
    const maxSize = 10 * 1024 * 1024;

    if (prodImage.size > maxSize) {
      throw new BadRequest("Files should not be more than 10MB");
    }
    const result = await cloudinary.uploader.upload(prodImage.tempFilePath, {
      use_filename: true,
      folder: "Product Images",
    });
    fs.unlinkSync(prodImage.tempFilePath);
    return result.secure_url;
  });
  try {
    const uploadedImages = await Promise.all(uploadPromises);

    res.status(StatusCodes.OK).json({
      images: uploadedImages.map((imageUrl) => ({ src: imageUrl })),
      // images: uploadedImages.map((imageUrl, index) => imageUrl),
    });
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Failed to upload images.",
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  removeProduct,
  uploadImages,
  getNumOfTimesSold,
};
