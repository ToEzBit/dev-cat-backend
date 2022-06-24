require("dotenv").config();
require("./config/passport");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const errorMiddleWare = require("./middlewares/error");
const notFoundMiddleWare = require("./middlewares/notFound");
const userPassportJwt = require("./middlewares/userPassportJwt");

const authRoute = require("./routes/authRoute");
const devRoute = require("./routes/devRoute");
const userRoute = require("./routes/userRoute");

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/dev", devRoute);
app.use("/user", userPassportJwt, userRoute);

app.use(errorMiddleWare);
app.use(notFoundMiddleWare);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Sever is running on port ${process.env.PORT}`)
);
