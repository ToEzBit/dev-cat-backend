const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

router.patch("/profile", userController.userUpdateProfile);

module.exports = router;
