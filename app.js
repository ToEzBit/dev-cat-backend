require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const errorMiddleWare = require("./middlewares/error");
const notFoundMiddleWare = require("./middlewares/notFound");

const authRoute = require("./routes/authRoute");

const app = express();
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use(errorMiddleWare);
app.use(notFoundMiddleWare);

app.listen(process.env.PORT || 8000, () =>
  console.log(`Sever is running on port ${process.env.PORT}`)
);
