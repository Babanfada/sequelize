const express = require("express");
const router = express.Router();
const {
  login,
  register,
  logout,
  verifyEmail,
  forgetPassword,
  resetPassword,
  checkUserRegisterationStatus,
  blackListUser,
  showMe,
} = require("../controllers/authflow");
const {
  authenticated,
  authorizedPermissions,
} = require("../middleware/authentication");

router.route("/login").post(login);
router.route("/check").get(checkUserRegisterationStatus);
router.route("/showme").get(authenticated, showMe);
router.route("/register").post(register);
router.route("/logout").delete(authenticated, logout);
router.route("/verify").post(verifyEmail);
router.route("/forgetPassword").post(forgetPassword);
router.route("/resetPassword").patch(resetPassword);
router
  .route("/blacklist/:id")
  .patch([authenticated, authorizedPermissions("admin")], blackListUser);

module.exports = router;
