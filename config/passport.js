const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Dev, User } = require("../models");
const JwtOptionDev = {
  secretOrKey: process.env.JWT_SECRET_KEY_DEV || "undefineKey",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const JwtOptionUser = {
  secretOrKey: process.env.JWT_SECRET_KEY_USER || "undefineKey",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

passport.use(
  "dev-rule",
  new JwtStrategy(JwtOptionDev, async (payload, done) => {
    try {
      const dev = await Dev.findOne({ where: { id: payload.id } });

      if (!dev) {
        return done(new Error("user not found"), false);
      }

      if (payload.iat * 1000 < new Date(dev.lastChangePassword).getTime()) {
        return done(new Error("You are unauthorized"), false);
      }

      return done(null, { id: dev.id });
    } catch (err) {
      done(err, false);
    }
  })
);

passport.use(
  "user-rule",
  new JwtStrategy(JwtOptionUser, async (payload, done) => {
    try {
      const user = await User.findOne({ where: { id: payload.id } });

      if (!user) {
        return done(new Error("user not found"), false);
      }

      if (payload.iat * 1000 < new Date(user.lastChangePassword).getTime()) {
        return done(new Error("You are unauthorized"), false);
      }

      return done(null, { id: user.id });
    } catch (err) {
      done(err, false);
    }
  })
);
