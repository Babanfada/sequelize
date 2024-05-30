const {
  getAllPromotion,
  getSinglePromotion,
  createPromotion,
  promotionImage,
  updatePromotion,
  removePromotion,
} = require("../controllers/promotion");
const express = require("express");
const router = express.Router();
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(getAllPromotion)
  .post([authenticated, authorizedPermissions("admin")], createPromotion);
router
  .route("/uploadpromimage")
  .post([authenticated, authorizedPermissions("admin")], promotionImage);
router
  .route("/:id")
  .post([authenticated, authorizedPermissions("admin")], updatePromotion)
  .delete([authenticated, authorizedPermissions("admin")], removePromotion);
router
  .route("/:id")
  .get(getSinglePromotion)
  .patch(authenticated, updatePromotion);

module.exports = router;
