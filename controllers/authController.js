const validator = require("validator");
const bcrypt = require("bcryptjs");

const { Dev, User } = require("../models");
const createError = require("../utils/createError");
const genToken = require("../utils/genToken");

exports.devRegister = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      createError("Passwords do not match", 400);
    }

    if (!email || !validator.isEmail(email)) {
      createError("Email is required", 400);
    }

    if (!username) {
      createError("Username is required", 400);
    }

    const existEmail = await Dev.findOne({
      where: {
        email: email,
      },
    });

    if (existEmail) {
      createError("Email already exists", 400);
    }

    const existUsername = await Dev.findOne({
      where: {
        username: username,
      },
    });

    if (existUsername) {
      createError("Username already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const lastDev = await Dev.findAll({ order: [["id", "DESC"]], limit: 1 });

    let oddId;

    if (lastDev.length > 0) {
      oddId = lastDev[0].id + 2;
    } else {
      oddId = 1;
    }
    const createdDev = await Dev.create({
      id: oddId,
      email: email,
      username: username,
      password: hashedPassword,
    });

    const token = genToken.dev({ id: createdDev.id, role: "dev" });

    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.devLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const dev = await Dev.findOne({
      where: {
        email: email,
      },
    });

    if (!dev) {
      createError("Email or password is incorrect", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, dev.password);

    if (!isPasswordValid) {
      createError("Email or password is incorrect", 400);
    }

    const token = genToken.dev({ id: dev.id, role: "dev" });

    dev.lastLogin = new Date();
    await dev.save();

    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.userRegister = async (req, res, next) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      createError("Passwords do not match", 400);
    }

    if (!email || !validator.isEmail(email)) {
      createError("Email is required", 400);
    }

    if (!username) {
      createError("Username is required", 400);
    }

    const existEmail = await User.findOne({
      where: {
        email: email,
      },
    });

    if (existEmail) {
      createError("Email already exists", 400);
    }

    const existUsername = await User.findOne({
      where: {
        username: username,
      },
    });

    if (existUsername) {
      createError("Username already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const lastUser = await User.findAll({ order: [["id", "DESC"]], limit: 1 });

    let evenId;

    if (lastUser.length > 0) {
      evenId = lastUser[0].id + 2;
    } else {
      evenId = 2;
    }

    const createdUser = await User.create({
      id: evenId,
      email: email,
      username: username,
      password: hashedPassword,
    });

    const token = genToken.user({ id: createdUser.id, role: "user" });

    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};

exports.userLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      createError("Email or password is incorrect", 400);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      createError("Email or password is incorrect", 400);
    }

    const token = genToken.user({ id: user.id, role: "user" });

    res.json({ token: token });
  } catch (err) {
    next(err);
  }
};
