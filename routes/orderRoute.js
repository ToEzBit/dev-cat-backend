const express = require("express");
const devPassportJwt = require("../middlewares/devPassportJwt");
const userPassportJwt = require("../middlewares/userPassportJwt");

const orderController = require("../controllers/orderController");
const router = express.Router();

router.post("/create-payment", orderController.createPaymentIntent);
router.post("/create-order", devPassportJwt, orderController.createOrder);
router.post(
  "/:orderId/special-requirement",
  devPassportJwt,
  orderController.createSpecialRequirement
);
router.delete(
  "/special-requirement/:specialRequirementId",
  devPassportJwt,
  orderController.deleteSpecialRequirement
);
router.patch(
  "/:orderId/status",
  devPassportJwt,
  orderController.updateOrderStatus
);
router.post("/:orderId/payment", orderController.payment);
router.patch(
  "/:orderId/complete/user",
  userPassportJwt,
  orderController.completeOrder
);
router.post(
  "/:orderId/review",
  userPassportJwt,
  orderController.createOrderReview
);

module.exports = router;
