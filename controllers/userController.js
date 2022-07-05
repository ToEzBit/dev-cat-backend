const bcrypt = require("bcryptjs");
const fs = require("fs");

const {
  User,
  Order,
  Product,
  Package,
  Dev,
  ProofPayment,
  OrderReview,
} = require("../models");
const createError = require("../utils/createError");
const cloundinary = require("../utils/cloundinary");

exports.userUpdateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;

    const { password, firstName, lastName, newPassword, confirmPassword } =
      req.body;

    if (!password) {
      createError("Password is required", 400);
    }

    const user = await User.findOne({ where: { id } });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      createError("Password is incorrect", 400);
    }

    if (newPassword) {
      if (newPassword !== confirmPassword) {
        createError("new passwords do not match", 400);
      }
      user.password = await bcrypt.hash(newPassword, 12);
      user.lastChangePassword = new Date();
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;

    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.userUpdateProfileImage = async (req, res, next) => {
  try {
    const { id } = req.user;

    if (!req.files) {
      createError("No file uploaded", 400);
    }
    const { image } = req.files;

    const uploadedImage = await cloundinary.upload(image[0].path, {
      folder: `dev-cat/user-profile/`,
    });

    const user = await User.findOne({ where: { id } });

    if (user.profileImage) {
      await cloundinary.destroy(user.profileImagePublicId);
    }

    user.profileImage = uploadedImage.secure_url;
    user.profileImagePublicId = uploadedImage.public_id;

    await user.save();

    res.json({ user });
  } catch (err) {
    next(err);
  } finally {
    if (req.files) {
      const { image } = req.files;
      fs.unlinkSync(image[0].path);
    }
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({
      where: { id },
      attributes: {
        exclude: ["password", "lastChangePassword", "createdAt", "updatedAt"],
      },
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { id: userId },
      attributes: {
        exclude: ["password", "lastChangePassword", "createdAt", "updatedAt"],
      },
    });

    res.json({ user });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const { id } = req.user;

    const orders = await Order.findAll({
      where: { userId: id },
      attributes: {
        exclude: [
          "createdAt",
          "updatedAt",
          "productId",
          "packageId",
          "userId",
          "devId",
        ],
      },
      include: [
        {
          model: Product,
          attributes: {
            exclude: ["createdAt", "updatedAt", "info", "devId"],
          },
        },
        {
          model: Package,
          attributes: {
            exclude: ["createdAt", "updatedAt", "info", "productId"],
          },
        },
        {
          model: Dev,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "email",
              "firstName",
              "lastName",
              "password",
              "lastChangePassword",
              "profileImagePublicId",
              "bankProvider",
              "bankAccountNumber",
            ],
          },
        },
        {
          model: ProofPayment,
          attributes: {
            exclude: ["createdAt", "updatedAt", "orderId"],
          },
        },
      ],
    });

    res.json({ orders });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      orderId,
      attributes: {
        exclude: ["productId", "packageId"],
      },
      include: [
        {
          model: Product,
          attributes: {
            exclude: ["createdAt", "updatedAt", "info", "devId"],
          },
        },
        {
          model: Package,
          attributes: {
            exclude: ["createdAt", "updatedAt", "info", "productId"],
          },
        },
        {
          model: ProofPayment,
          attributes: {
            exclude: ["orderId"],
          },
        },
        {
          model: OrderReview,
          attributes: {
            exclude: ["orderId"],
          },
        },
      ],
    });
    if (!order) {
      createError("Order not found", 404);
    }

    if (order.userId != req.user.id) {
      createError("You don't have permission", 404);
    }
    res.json({ order });
  } catch (err) {
    next(err);
  }
};
