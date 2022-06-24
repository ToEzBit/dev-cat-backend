exports.devUpdateProfile = async (req, res, next) => {
  try {
    const { id } = req.user;
    console.log("dev");
  } catch (err) {
    next(err);
  }
};
