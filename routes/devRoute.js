const express = require("express");
const upload = require("../middlewares/upload");
const devPassportJwt = require("../middlewares/devPassportJwt");

const router = express.Router();

const devController = require("../controllers/devController");

router.patch("/profile", devPassportJwt, devController.devUpdateProfile);
router.patch(
  "/profile/image",
  devPassportJwt,
  upload.fields([{ name: "image", maxCount: 1 }]),
  devController.devUpdateProfileImage
);
router.post("/skill", devPassportJwt, devController.createDevSkill);
router.delete("/skill/:skillId", devPassportJwt, devController.deleteDevSkill);
router.get("/me", devPassportJwt, devController.getDevProfile);
router.get("/orders", devPassportJwt, devController.getMyOrders);
router.get("/order/:orderId", devPassportJwt, devController.getMyOrderById);
router.get("/:devId", devController.getDevById);

module.exports = router;
