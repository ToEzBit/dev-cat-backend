const router = require("express").Router();
const { Conversation, Chat } = require("../models");
const { Op } = require("sequelize");

//new conv

router.post("/", async (req, res) => {
  console.log(req.body);
  if (req.body.senderId === req.body.receiverId) {
    return res.status(200).json("coversation same user");
  }
  const conversation = await Conversation.findAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            { senderId: req.body.senderId },
            { receiverId: req.body.receiverId },
          ],
        },
        {
          [Op.and]: [
            { senderId: req.body.receiverId },
            { receiverId: req.body.senderId },
          ],
        },
      ],
    },
  });

  console.log(conversation);
  if (conversation.length !== 0) {
    return res.status(200).json("coversation exits");
  }

  const newConversation = {
    senderId: req.body.senderId,
    receiverId: req.body.receiverId,
  };
  const resMe = await Conversation.create(newConversation);
  res.status(200).json(resMe);

  // try {
  //     const savedConversation = await newConversation.save();
  // } catch (err) {
  //     res.status(500).json(err);
  // }
});

//get conv of a user

router.get("/:userId", async (req, res, next) => {
  try {
    // console.log(req.params.userId);
    const conversation = await Conversation.findAll({
      where: {
        [Op.or]: [
          { senderId: req.params.userId },
          { receiverId: req.params.userId },
        ],
      },
      include: [
        {
          model: Chat,
        },
      ],
    });
    console.log(conversation);
    res.status(200).json(conversation);
  } catch (error) {
    // res.status(500).json(err);
    next(error);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: {
        $all: [req.params.firstUserId, req.params.secondUserId],
      },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
