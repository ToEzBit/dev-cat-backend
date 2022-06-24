const passport = require("passport");

module.exports = passport.authenticate("dev-rule", { session: false });
