const express = require("express");
const router = express.Router();

const mailController = require("../controllers/mailController");

router.post("/forget-password", mailController.forgetPassword);
router.post("/check-email-key", mailController.checkEmailKey);
module.exports = router;
