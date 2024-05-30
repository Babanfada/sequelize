const { StatusCodes } = require("http-status-codes");
const db = require("../models");
const { BadRequest } = require("../errors");
const {
  reviews: Review,
  products: Products,
  users: Users,
  orders: Orders,
  deliveryAddress: DeliveryAddress,
  sequelize,
} = db;

const createReview = async (req, res) => {
  // check if the product existed
  const productExisted = await Products.findOne({
    where: { _id: req.body.productId },
  });
  if (!productExisted) {
    throw new BadRequest("the product about to be reviewed does not exist");
  }

  const alreadeyExisted = await Review.findOne({
    where: { userId: req.user.userId, productId: req.body.productId },
  });
  // check if user already reviewed product
  if (alreadeyExisted) {
    throw new BadRequest("You already reviewed this product");
  }
  req.body.userId = req.user.userId;

  const review = await Review.create({ ...req.body });

  res.status(StatusCodes.OK).json({ review });
};

const getAllReviews = async (req, res) => {
  const reviews = await Review.findAll({});
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

const getSingleReview = async (req, res) => {
  const review = await Review.findone({ where: { _id: req.params } });
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  // const { id: reviewId } = req.params;
  const { productId } = req.body;
  const review = await Review.findOne({
    where: { productId, userId: req.user.userId },
  });
  if (!review) {
    throw new BadRequest(
      `This product with id: ${productId} has not been reviewed previously`
    );
  }
  await Review.update(req.body, {
    where: { productId },
  });
  res.status(StatusCodes.OK).json({
    review,
    msg: `Review update of product with id: ${productId}, successful`,
  });
};
const deleteReview = async (req, res) => {
  const { id: reviewId } = req.params;
  const { productId } = req.body;
  const review = await Review.findOne({
    where: { productId, userId: req.user.userId },
  });
  if (!review) {
    throw new BadRequest(
      ` This product with id:${productId} has not been reviewed previously`
    );
  }
  await Review.destroy({
    where: { _id: reviewId },
  });
  res.status(StatusCodes.OK).json({
    msg: `Review  with id: ${reviewId}, successfully destroyed`,
  });
};

const getSingleProductReviews = async (req, res) => {
  const { id: productId } = req.params;
  // console.log(Users, Orders);
  const result = await Products.findOne({
    where: {
      _id: productId,
    },
    attributes: [
      ["name", "productName"],
      ["_id", "productId"],
      ["reviews.rating", "rating"],
      ["reviews.comment", "comment"],
      ["reviews.title", "title"],
      ["reviews.user", "userId"],
      ["users.fullname", "userName"],
      ["reviews.createdAt", "reviewCreatedAt"],
      ["reviews.updatedAt", "reviewUpdatedAt"],
      ["orders.createdAt", "orderCreatedAt"],
      ["orders.updatedAt", "orderUpdatedAt"],
      // ["deliveryaddress.country"],
      // ["deliveryaddress.state"],
    ],

    include: [
      {
        model: Review,
        attributes: [],
        // required: true,
        // all: true,
        // nested: true,
        // include: [
        //   {
        //     model: Users,
        //     attributes: ["fullname"],
        //     // required: true,
        //     // all: true,
        //     // nested: true,
        //     include: [
        //       {
        //         model: Orders,
        //         attributes: ["createdAt", "updatedAt"],
        //         // required: true,
        //         all: true,
        //         // nested: true,
        //         include: [
        //           {
        //             model: DeliveryAddress,
        //             attributes: ["country", "state"],
        //             // required: true,
        //             // all: true,
        //             // nested: true,
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // ],
        
      },
    ],
    raw: true,
  });

  // console.log(result);

  res.status(StatusCodes.OK).json({ result });
};

const getSingleProductReviewBySingleUser = async (req, res) => {
  const { id: productId } = req.params;
  const { userId } = req.user;
  const result = await Review.findAll({
    attributes: [
      [sequelize.literal("products.name"), "productName"],
      [sequelize.literal("products._id"), "productId"],
      ["rating"],
      ["comment"],
      ["title"],
      [sequelize.literal("reviews.user"), "userId"],
      [sequelize.literal("users.fullname"), "userName"],
      ["createdAt", "reviewCreatedAt"],
      ["updatedAt", "reviewUpdatedAt"],
      [sequelize.literal("orders.createdAt"), "orderCreatedAt"],
      [sequelize.literal("orders.updatedAt"), "orderUpdatedAt"],
      ["country"],
      ["state"],
    ],
    include: [
      {
        model: Products,
        // attributes: [],
        // where: {
        //   _id: productId,
        // },
      },
      {
        model: Users,
        attributes: [],
        include: [
          {
            model: Orders,
            // attributes: [],
            // where: {
            //   user: userId,
            // },
            include: [
              {
                model: DeliveryAddress,
                // attributes: [],
                // where: {
                //   order: sequelize.col("orders._id"),
                // },
                required: false,
              },
            ],
            required: false,
          },
        ],
        required: false,
      },
    ],
    where: {
      "products._id": productId,
      "users._id": userId,
    },
    raw: true, // Set to true to get plain JSON objects instead of Sequelize instances
  });

  res.status(StatusCodes.OK).json({ result });
};

const getAllProductReviewsAdmin = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "you are on" });
};
const uploadImages = (req, res) => {
  res.status(StatusCodes.OK).json({ msg: "you are on" });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
  getAllProductReviewsAdmin,
  uploadImages,
  getSingleProductReviewBySingleUser,
};
