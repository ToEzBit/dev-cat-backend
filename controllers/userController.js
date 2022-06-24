exports.userUpdateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log("user");
  } catch (err) {
    next(err);
  }
};
