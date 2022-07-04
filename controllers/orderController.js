const createError = require("../utils/createError");

const stripe = require("stripe")(
  "sk_test_51LGO25J0De5S2BwxeWzkrTS7PSCLuMXUuDGZlmJhYvzKBU6KpwTfZGOl0zGvNeQepEfHKWADIrWpi3WvO64mrkZQ00vMlcjOgu"
);

const priceInCent = (price) => {
  return price * 100;
};

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { orderId } = req.body;

    if (!oderId) {
      createError("Order id is required", 400);
    }
    const order = await Order.findOne({ where: { id: orderId } });
    const user = await User.findOne({ where: { id: id } });

    if (!order) {
      createError("Order not found", 404);
    }

    if (!user) {
      createError("User not found", 404);
    }

    if (user.Id !== order.userId) {
      createError("Unauthorised access", 401);
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: priceInCent(100),
      currency: "thb",
      payment_method_types: ["card"],
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

exports.createOrder = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { userId, productId, packageId } = req.body;

    if (!userId) {
      createError("userId is required", 400);
    }
    if (!productId) {
      createError("productId is required", 400);
    }
    if (!packageId) {
      createError("packageId is required", 400);
    }
    const user = await User.findOne({ where: { id: userId } });
    const product = await Product.findOne({ where: { id: productId } });
    const package = await Package.findOne({ where: { id: packageId } });

    if (!user) {
      createError("user not found", 404);
    }
    if (!product) {
      createError("product not found", 400);
    }

    if (!package) {
      createError("package not found", 400);
    }

    if (package.productId !== productId) {
      createError("invalid  package", 400);
    }

    const createdOrder = await Order.create({
      devId: id,
      userId,
      productId,
      packageId,
      totalRevision: package.revision,
      currentRevision: 0,
      packagePrice: package.price,
      totalSpacialRequirementPrice: 0,
      totalPrice: package.price,
      startDate: null,
      totalDuration: package.duration,
      endDate: null,
      status: "pending",
      paymentStatus: "awaitingPayment",
    });

    res.json({ createdOrder });
  } catch (err) {
    next(err);
  }
};

exports.createSpecialRequirement = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { title, detail, price, duration } = req.body;

    if (!orderId) {
      createError("orderId is required", 400);
    }

    if (!title) {
      createError("title is required", 400);
    }

    if (!detail) {
      createError("detail is required", 400);
    }

    if (!price) {
      createError("price is required", 400);
    }

    if (!duration) {
      createError("duration is required", 400);
    }

    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      createError("order not found", 404);
    }

    const createdSpecialRequirement = await SpecialRequirement.create({
      orderId,
      title,
      detail,
      price,
      duration,
    });

    order.totalSpacialRequirementPrice =
      +order.totalSpacialRequirementPrice + price;
    order.totalPrice = +order.totalPrice + price;
    order.totalDuration = +order.totalDuration + duration;
    order.paymentStatus = "awaitAdditionalPayment";
    await order.save();
    res.json({ createdSpecialRequirement });
  } catch (err) {
    next(err);
  }
};

exports.deleteSpecialRequirement = async (req, res, next) => {
  try {
    const { specialRequirementId } = req.params;

    if (!specialRequirementId) {
      createError("specialRequirementId is required", 400);
    }

    const specialRequirement = await SpecialRequirement.findOne({
      where: { id: specialRequirementId },
    });

    if (!specialRequirement) {
      createError("specialRequirement not found", 404);
    }

    const order = await Order.findOne({
      where: { id: specialRequirement.orderId },
    });

    if (!order) {
      createError("order not found", 404);
    }

    order.totalSpacialRequirementPrice =
      +order.totalSpacialRequirementPrice - specialRequirement.price;
    order.totalPrice = +order.totalPrice - specialRequirement.price;
    order.totalDuration = +order.totalDuration - specialRequirement.duration;
    order.paymentStatus = "paymentReceived";
    await order.save();
    await SpecialRequirement.destroy({ where: { id: specialRequirementId } });
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId) {
      createError("orderId is required", 400);
    }

    if (!status) {
      createError("status is required", 400);
    }

    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      createError("order not found", 404);
    }

    if (order.devId !== id) {
      createError("you are not allowed to update this order", 403);
    }

    order.status = status;
    if (status === "Inprogress") {
      order.startDate = new Date();
      order.endDate = new Date().setDate(
        order.startDate.getDate() + order.totalDuration
      );
      order.status = "Inprogress";
    }

    if (status === "awaitingReview") {
      order.status = "awaitingReview";
    }

    if (status === "cancelled") {
      order.status = "cancelled";
    }

    await order.save();
    res.json({ order });
  } catch (err) {
    if (err.message === "Data truncated for column 'status' at row 1") {
      err.message = "Status is invalid";
    }
    next(err);
  }
};

exports.payment = async (req, res, next) => {
  try {
    // const { id } = req.user;
    const id = 2;
    const { orderId } = req.params;
    const { transactionId } = req.body;

    if (!orderId) {
      createError("orderId is required", 400);
    }
    if (!transactionId) {
      createError("transactionId is required", 400);
    }

    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      createError("order not found", 404);
    }

    if (order.userId !== id) {
      createError("you are not allowed to pay this order", 403);
    }

    if (order.paymentStatus === "paymentReceived") {
      createError("payment already received", 400);
    }

    const createdPayment = await ProofPayment.create({
      orderId,
      transactionId,
      spacialRequire,
    });

    order.paymentStatus = "paymentReceived";
    await order.save();
    res.json({ createdPayment });
  } catch (err) {
    next(err);
  }
};

exports.completeOrder = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { orderId } = req.params;

    if (!orderId) {
      createError("orderId is required", 400);
    }

    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      createError("order not found", 404);
    }

    if (order.userId !== id) {
      createError("you are not allowed to complete this order", 403);
    }

    if (order.status !== "awaitingReview") {
      createError("order is not in awaitingReview status", 400);
    }

    order.status = "completed";
    await order.save();
    res.json({ order });
  } catch (err) {
    next(err);
  }
};

exports.createOrderReview = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { orderId } = req.params;
    const { reviewDetail } = req.body;

    const order = await Order.findOne({ where: { id: orderId } });

    if (!order) {
      createError("order not found", 404);
    }

    if (order.userId !== id) {
      createError("you are not allowed to review this order", 403);
    }

    if (order.status !== "awaitingReview") {
      createError("order is not in awaitingReview status", 400);
    }

    if (order.currentRevision >= order.totalRevision) {
      createError("order in max count review", 400);
    }

    const createdReview = await OrderReview.create({
      orderId,
      reviewDetail,
      countRevision: +order.currentRevision + 1,
    });
    order.status = "needRevision";
    order.currentRevision = +order.currentRevision + 1;
    await order.save();
    res.json({ createdReview });
  } catch (err) {
    next(err);
  }
};
