const fs = require("fs");
const createError = require("../utils/createError");
const cloundinary = require("../utils/cloundinary");
const {
  Product,
  ProductImage,
  Package,
  PackageDetail,
  ProductReview,
  Dev,
  User,
} = require("../models");

exports.createProduct = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { title, info, category } = req.body;

    if (!title) {
      createError("title is require", 400);
    }

    if (!info) {
      createError("info is require", 400);
    }

    if (!category) {
      createError("category is require", 400);
    }

    const createdProduct = await Product.create({
      title,
      info,
      category,
      devId: id,
    });

    res.json({ createdProduct });
  } catch (err) {
    if (err.message === "Data truncated for column 'category' at row 1") {
      err.message = "Category is invalid";
    }
    next(err);
  }
};

exports.addProductImage = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;
    const { role } = req.body;
    const image = req.file;

    const product = await Product.findOne({
      where: { id: productId, devId: id },
    });

    if (!image) {
      createError("Image is required", 400);
    }

    if (!product) {
      createError("Product not found", 404);
    }

    const uploadedImage = await cloundinary.upload(image.path, {
      folder: `dev-cat/product-image/`,
    });

    const createdProductImage = await ProductImage.create({
      productId,
      image: uploadedImage.secure_url,
      publicId: uploadedImage.public_id,
      role,
    });
    res.json({ createdProductImage });
  } catch (err) {
    if (err.message === "Data truncated for column 'role' at row 1") {
      err.message = "role is invalid";
    }
    next(err);
  } finally {
    const image = req.file;
    fs.unlinkSync(image.path);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;
    const { title, info, category } = req.body;

    console.log("first");

    const product = await Product.findOne({
      where: { id: productId, devId: id },
    });

    if (!product) {
      createError("Product not found", 404);
    }

    product.title = title || product.title;
    product.info = info || product.info;
    product.category = category || product.category;
    await product.save();
    res.json({ product });
  } catch (err) {
    if (err.message === "Data truncated for column 'category' at row 1") {
      err.message = "Category is invalid";
    }
    next(err);
  }
};

exports.addProductPackage = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;
    const { title, info, revision, duration, price } = req.body;

    if (!productId) {
      createError("Product id is required", 400);
    }

    if (!title) {
      createError("title is require", 400);
    }

    if (!info) {
      createError("info is require", 400);
    }

    if (!revision) {
      createError("revision is require", 400);
    }

    if (!duration) {
      createError("duration is require", 400);
    }

    if (!price) {
      createError("price is require", 400);
    }

    const product = await Product.findOne({
      where: { id: productId, devId: id },
    });

    if (!product) {
      createError("Product not found", 404);
    }

    const createdProductPackage = await Package.create({
      productId,
      title,
      info,
      revision,
      duration,
      price,
    });

    res.json({ createdProductPackage });
  } catch (err) {
    next(err);
  }
};

exports.updateProductPackage = async (req, res, next) => {
  try {
    const { title, info, revision, duration, price } = req.body;
    const { packageId } = req.params;

    if (!packageId) {
      createError("packageId is required", 400);
    }

    const package = await Package.findOne({ where: { id: packageId } });

    if (!package) {
      createError("Package not found", 404);
    }

    package.title = title || package.title;
    package.info = info || package.info;
    package.revision = revision || package.revision;
    package.duration = duration || package.duration;
    package.price = price || package.price;
    await package.save();

    res.json({ package });
  } catch (err) {
    next(err);
  }
};

exports.addPackageDetail = async (req, res, next) => {
  try {
    const { packageId } = req.params;
    const { title, value } = req.body;

    if (!title) {
      createError("title is require", 400);
    }

    const package = await Package.findOne({ where: { id: packageId } });

    if (!package) {
      createError("Package not found", 404);
    }

    const createPackageDetail = await PackageDetail.create({
      packageId,
      title,
      value,
    });

    res.json({ createPackageDetail });
  } catch (err) {
    next(err);
  }
};

exports.updatePackageDetail = async (req, res, next) => {
  try {
    const { detailId } = req.params;
    const { title, value } = req.body;

    if (!detailId) {
      createError("detailId is required", 400);
    }

    const packageDetail = await PackageDetail.findOne({
      where: { id: detailId },
    });
    if (!packageDetail) {
      createError("PackageDetail not found", 404);
    }

    packageDetail.title = title || packageDetail.title;
    packageDetail.value = value || packageDetail.value;
    await packageDetail.save();
    res.json({ packageDetail });
  } catch (err) {
    next(err);
  }
};

exports.createProductReview = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId } = req.params;
    const { message, rate, isAnonymous } = req.body;

    if (!productId) {
      createError("productId is required", 400);
    }

    if (!message) {
      createError("message is required", 400);
    }

    if (!rate) {
      createError("rate is required", 400);
    }

    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      createError("Product not found", 404);
    }

    const createdReview = await ProductReview.create({
      devId: product.devId,
      productId,
      message,
      rate,
      isAnonymous,
      userId: id,
    });
    res.json({ createdReview });
  } catch (err) {
    next(err);
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    const offset = (page - 1) * limit;
    const products = await Product.findAll({
      offset: +offset,
      limit: +limit,
      attributes: {
        exclude: ["devId", "createdAt", "updatedAt", "info"],
      },
      include: [
        {
          model: Dev,
          attributes: {
            exclude: [
              "id",
              "firstName",
              "lastName",
              "createdAt",
              "updatedAt",
              "email",
              "password",
              "lastChangePassword",
              "profileImagePublicId",
              "bankProvider",
              "bankAccountNumber",
            ],
          },
        },
        {
          model: ProductImage,
          where: { role: "thumbnail" },
          attributes: {
            exclude: [
              "id",
              "publicId",
              "imageOrder",
              "productId",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        {
          model: Package,
          attributes: ["price"],
        },
        {
          model: ProductReview,
          attributes: ["rate"],
        },
      ],
    });
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getAllDevProducts = async (req, res, next) => {
  try {
    const { devId } = req.params;

    const products = await Product.findAll({
      where: { devId },
      attributes: {
        exclude: ["devId", "createdAt", "updatedAt", "info"],
      },
      include: [
        {
          model: Dev,
          attributes: {
            exclude: [
              "id",
              "firstName",
              "lastName",
              "createdAt",
              "updatedAt",
              "email",
              "password",
              "lastChangePassword",
              "profileImagePublicId",
              "bankProvider",
              "bankAccountNumber",
            ],
          },
        },
        {
          model: ProductImage,
          where: { role: "thumbnail" },
          attributes: {
            exclude: [
              "id",
              "publicId",
              "imageOrder",
              "productId",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        {
          model: Package,
          attributes: ["price"],
        },
        {
          model: ProductReview,
          attributes: ["rate"],
        },
      ],
    });
    res.json({ products });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      createError("productId is required", 400);
    }

    const product = await Product.findOne({
      where: { id: productId },
      attributes: {
        exclude: ["devId", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: Dev,
          attributes: {
            exclude: [
              "password",
              "lastChangePassword",
              "profileImagePublicId",
              "bankProvider",
              "bankAccountNumber",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        {
          model: ProductImage,
          attributes: {
            exclude: ["publicId", "imageOrder", "productId", "updatedAt"],
          },
        },
        {
          model: Package,
          attributes: {
            exclude: ["createdAt", "updatedAt", "productId"],
          },
          include: [
            {
              model: PackageDetail,
              attributes: ["id", "title", "value"],
            },
          ],
        },
        {
          model: ProductReview,
          attributes: {
            exclude: ["devId", "createdAt", "updatedAt", "productId"],
          },
          include: [
            {
              model: User,
              attributes: {
                exclude: [
                  "email",
                  "password",
                  "firstName",
                  "lastName",
                  "lastChangePassword",
                  "profileImagePublicId",
                  "createdAt",
                  "updatedAt",
                ],
              },
            },
          ],
        },
      ],
    });
    if (!product) {
      createError("Product not found", 404);
    }

    res.json({ product });
  } catch (err) {
    next(err);
  }
};

exports.deleteProductImage = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const productImage = await ProductImage.findOne({ where: { id: imageId } });

    if (!productImage) {
      createError("Product image not found", 404);
    }

    await cloundinary.destroy(productImage.publicId);
    await productImage.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.deletePackageDetail = async (req, res, next) => {
  try {
    const { packageDetailId } = req.params;

    const packageDetail = await PackageDetail.findOne({
      where: { id: packageDetailId },
    });

    if (!packageDetail) {
      createError("Package detail not found", 404);
    }

    await packageDetail.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};

exports.editProductReview = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { reviewId } = req.params;
    const { message, rate, isAnonymous } = req.body;

    const productReview = await ProductReview.findOne({
      where: { id: reviewId },
    });

    if (!productReview) {
      createError("Product review not found", 404);
    }

    if (productReview.userId !== id) {
      createError("You are not allowed to edit this review", 403);
    }

    await productReview.update({
      message,
      rate,
      isAnonymous,
    });
    res.json({ productReview });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { reviewId } = req.params;

    const productReview = await ProductReview.findByPk(reviewId);

    if (!productReview) {
      createError("Product review not found", 404);
    }
    if (productReview.userId !== id) {
      createError("You are not allowed to delete this review", 403);
    }

    await productReview.destroy();
    res.status(204).json();
  } catch (err) {
    next(err);
  }
};
