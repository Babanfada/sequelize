const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
  getAllProductReviewsAdmin,
  uploadImages,
  getSingleProductReviewBySingleUser,
} = require("../controllers/review");

const router = require("express").Router();

const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router.route("/").post(authenticated, createReview).get(getAllReviews);
router.route("/uploadreviewImages").post(authenticated, uploadImages);
router.route("/getallproductreviewsadmin").get(getAllProductReviewsAdmin);
router.route("/getSingleproductreviews/:id").get(getSingleProductReviews);
router
  .route("/getSingleproductreviewsbyuser/:id")
  .get(authenticated, getSingleProductReviewBySingleUser);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(authenticated, updateReview)
  .delete(authenticated, deleteReview);

module.exports = router;
