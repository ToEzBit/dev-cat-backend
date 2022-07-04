const nodemailer = require("nodemailer");
const generator = require("generate-password");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const createError = require("../utils/createError");
const { User, Dev } = require("../models");

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email, mode } = req.body;

    if (!validator.isEmail(email)) {
      createError("Email is required", 400);
    }
    if (!mode) {
      createError("Mode is required", 400);
    }
    const secretKey = generator.generate({
      length: 6,
      numbers: true,
    });

    var clientEmail;
    if (mode === "user") {
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        createError("Email not found", 404);
      }
      clientEmail = user.email;
      user.forgetKey = secretKey;
      await user.save();
    }

    if (mode === "dev") {
      const dev = await Dev.findOne({ where: { email } });

      if (!dev) {
        createError("Email not found", 404);
      }
      clientEmail = dev.email;
      dev.forgetKey = secretKey;
      await dev.save();
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const option = {
      from: process.env.EMAIL,
      to: clientEmail,
      subject: "Forget Password",
      attachments: [
        {
          filename: "ProfilePic_oxuthg.png",
          path: "https://res.cloudinary.com/myclound/image/upload/v1656868171/ProfilePic_oxuthg.png",
          cid: "logo",
        },
      ],
      html: `<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
          style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
          <tr>
              <td>
                  <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                      align="center" cellpadding="0" cellspacing="0">
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                              <img width="60" src="cid:logo" alt="logo"/>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td>
                              <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                  style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                                  <tr>
                                      <td style="padding:0 35px;">
                                          <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                              requested to reset your password</h1>
                                          <span
                                              style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                          <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                              We cannot simply send you your old password. A unique key to reset your
                                              password has been generated for you. To reset your password,
                                          </p>
                                          <span
                                          style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                          <h1
                                          style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">
                                              ${secretKey}</h1>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="height:40px;">&nbsp;</td>
                                  </tr>
                              </table>
                          </td>
                      <tr>
                          <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                          <td style="text-align:center;">
                              <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.devcat.com</strong></p>
                          </td>
                      </tr>
                      <tr>
                          <td style="height:80px;">&nbsp;</td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>`,
    };

    transporter.sendMail(option, (err, data) => {
      if (err) {
        createError(err);
      }
      res.status(200).json({ response: data });
    });
  } catch (err) {
    next(err);
  }
};

exports.checkEmailKey = async (req, res, next) => {
  try {
    const { key, email, mode, password, confirmPassword } = req.body;
    if (!key || !email || !mode) {
      createError("Key or email or mode is required", 400);
    }
    if (password != confirmPassword) {
      createError("Password and confirm password is not match", 400);
    }
    if (mode === "user") {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        createError("Email not found", 404);
      }
      if (user.forgetKey !== key) {
        createError("Invalid key", 400);
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      user.password = hashedPassword;
      user.forgetKey = "";
      user.lastChangePassword = new Date();
      await user.save();
    }
    if (mode === "dev") {
      const dev = await Dev.findOne({ where: { email } });
      if (!dev) {
        createError("Email not found", 404);
      }
      if (dev.forgetKey !== key) {
        createError("Invalid key", 400);
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      dev.password = hashedPassword;
      dev.forgetKey = "";
      dev.lastChangePassword = new Date();
      await dev.save();
    }

    res.status(200).json({ response: "Password has been changed" });
  } catch (err) {
    next(err);
  }
};
