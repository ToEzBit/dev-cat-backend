const express = require("express");
const router = express.Router();

const devController = require("../controllers/devController");

router.patch("/profile", devController.devUpdateProfile);

module.exports = router;
