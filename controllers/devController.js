const bcrypt = require("bcryptjs");
const fs = require("fs");

const cloundinary = require("../utils/cloundinary");
const createError = require("../utils/createError");
const { Dev, DevSkill } = require("../models");

exports.devUpdateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;

    const {
      password,
      firstName,
      lastName,
      bankProvider,
      bankAccountNumber,
      newPassword,
      confirmPassword,
    } = req.body;

    if (!password) {
      createError("Password is required", 400);
    }

    const dev = await Dev.findOne({ where: { id } });

    const isPasswordValid = await bcrypt.compare(password, dev.password);

    if (!isPasswordValid) {
      createError("Password is incorrect", 400);
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        createError("new passwords do not match", 400);
      }
      dev.password = await bcrypt.hash(newPassword, 12);
      dev.lastChangePassword = new Date();
    }

    dev.firstName = firstName || dev.firstName;
    dev.lastName = lastName || dev.lastName;
    dev.bankProvider = bankProvider || dev.bankProvider;
    dev.bankAccountNumber = bankAccountNumber || dev.bankAccountNumber;

    await dev.save();

    res.json({ dev });
  } catch (err) {
    next(err);
  }
};

exports.devUpdateProfileImage = async (req, res, next) => {
  try {
    const { id } = req.user;

    if (!req.files) {
      createError("No file uploaded", 400);
    }
    const { image } = req.files;

    const uploadedImage = await cloundinary.upload(image[0].path, {
      folder: `dev-cat/user-profile/`,
    });

    const dev = await Dev.findOne({ where: { id } });

    if (dev.profileImage) {
      await cloundinary.destroy(dev.profileImagePublicId);
    }

    dev.profileImage = uploadedImage.secure_url;
    dev.profileImagePublicId = uploadedImage.public_id;

    await dev.save();

    res.json({ dev });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      const { image } = req.files;
      fs.unlinkSync(image[0].path);
    }
  }
};

exports.createDevSkill = async (req, res, next) => {
  try {
    const { id } = req.user;

    const { password, title, value, category } = req.body;

    if (!password) {
      createError("Password is required", 400);
    }

    if (!title) {
      createError("Title is required", 400);
    }

    if (!value) {
      createError("Value is required", 400);
    }

    if (!category) {
      createError("Category is required", 400);
    }

    const dev = await Dev.findOne({ where: { id } });

    const isPasswordValid = await bcrypt.compare(password, dev.password);

    if (!isPasswordValid) {
      createError("Password is incorrect", 400);
    }

    const createdSkill = await DevSkill.create({
      devId: dev.id,
      category,
      title,
      value,
    });

    res.json({ createdSkill });
  } catch (err) {
    if (err.message === "Data truncated for column 'category' at row 1") {
      err.message = "Category is invalid";
    }
    next(err);
  }
};

exports.deleteDevSkill = async (req, res, next) => {
  try {
    const { id } = req.user;

    const { skillId } = req.params;

    if (!skillId) {
      createError("Skill id is required", 400);
    }

    const skill = await DevSkill.findOne({ where: { id: skillId } });

    if (!skill) {
      createError("Skill not found", 404);
    }

    if (skill.devId !== id) {
      createError("you don't have permission", 404);
    }

    await skill.destroy();

    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.getDevProfile = async (req, res, next) => {
  try {
    const { id } = req.user;

    const dev = await Dev.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "lastChangePassword", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: DevSkill,
          attributes: {
            exclude: ["createdAt", "updatedAt", "devId"],
          },
        },
      ],
    });

    res.json({ dev });
  } catch (err) {
    next(err);
  }
};

exports.getDevById = async (req, res, next) => {
  try {
    const { devId } = req.params;

    const dev = await Dev.findOne({
      where: { id: devId },
      attributes: {
        exclude: [
          "password",
          "lastChangePassword",
          "createdAt",
          "updatedAt",
          "bankAccountNumber",
          "bankProvider",
        ],
      },
      include: [
        {
          model: DevSkill,
          attributes: {
            exclude: ["createdAt", "updatedAt", "devId"],
          },
        },
      ],
    });

    res.json({ dev });
  } catch (err) {
    next(err);
  }
};
