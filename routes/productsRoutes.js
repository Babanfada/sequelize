const router = require("express").Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  removeProduct,
  uploadImages,
  getNumOfTimesSold,
} = require("../controllers/products");

const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(getAllProducts)
  .post([authenticated, authorizedPermissions("admin")], createProduct);

router.route("/numoftimessold").get(getNumOfTimesSold);

router
.route("/uploadimage")
.post([authenticated, authorizedPermissions("admin")], uploadImages);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticated, authorizedPermissions("admin")], updateProduct)
  .delete([authenticated, authorizedPermissions("admin")], removeProduct);
module.exports = router;
