const express = require("express");
const upload = require("../middlewares/upload");
const userPassportJwt = require("../middlewares/userPassportJwt");
const router = express.Router();

const userController = require("../controllers/userController");

router.patch("/profile", userPassportJwt, userController.userUpdateProfile);
router.patch(
  "/profile/image",
  userPassportJwt,
  upload.fields([{ name: "image", maxCount: 1 }]),
  userController.userUpdateProfileImage
);
router.get("/me", userPassportJwt, userController.getMe);
router.get("/orders", userPassportJwt, userController.getMyOrders);
router.get("/:userId", userController.getUserById);

module.exports = router;
