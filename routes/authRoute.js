const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.post("/dev/register", authController.devRegister);
router.post("/dev/login", authController.devLogin);
router.post("/user/register", authController.userRegister);
router.post("/user/login", authController.userLogin);

module.exports = router;
