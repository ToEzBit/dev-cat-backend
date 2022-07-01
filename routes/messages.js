const router = require("express").Router();
const { Chat, Conversation } = require("../models");
// const { Op } = require("sequelize");

//add

router.post("/", async (req, res, next) => {
  const newMessage = req.body;
  newMessage.read = false;

  try {
    const savedMessage = await Chat.create(newMessage);
    res.status(200).json(savedMessage);
  } catch (error) {
    next(error);
  }
});

//get

router.get("/:conversationId", async (req, res, next) => {
  try {
    const messages = await Chat.findAll({
      where: {
        conversationId: req.params.conversationId,
      },
    });
    console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
