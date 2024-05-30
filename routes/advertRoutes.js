const router = require("express").Router();
const {
  getAdvert,
  createAdvert,
  updateAdvert,
} = require("../controllers/advert");

const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router
  .route("/")
  .get(authenticated, getAdvert)
  .post([authenticated, authorizedPermissions("admin")], createAdvert);
router
  .route("/:id")
  .patch([authenticated, authorizedPermissions("admin")], updateAdvert);

module.exports = router;
