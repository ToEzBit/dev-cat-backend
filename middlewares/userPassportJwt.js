const passport = require("passport");

module.exports = passport.authenticate("user-rule", { session: false });
