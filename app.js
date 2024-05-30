require("dotenv").config();
require("express-async-errors");
// server
const express = require("express");
const app = express();
const port = process.env.PORT || 5007;
const connectDB = require("./models");
// middlewares
const notFound = require("./middleware/notFound");
const errorHandlerMiddleWare = require("./middleware/errorHandler");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// file upload
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
// app.get("/log", (req, res) => {
//   res.status(200).json({ msg: "home page" });
// });
// middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(cookieParser(process.env.JWT_SECRET));

// routers
const authRouter = require("./routes/authflowRoutes");
const ProductRouter = require("./routes/productsRoutes");
const advertRouter = require("./routes/advertRoutes");
const promRouter = require("./routes/promotionRoutes");
const reviewsRouter = require("./routes/reviewRoutes");

// File upload
app.use(fileUpload({ useTempFiles: true }));
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

app.use("/api/v1/authflow", authRouter);
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/adverts", advertRouter);
app.use("/api/v1/proms", promRouter);
app.use("/api/v1/reviews", reviewsRouter);

app.use(notFound);
app.use(errorHandlerMiddleWare);

// connect to mysql da and start the server
connectDB.sequelize
  .sync()
  .then(() => {
    // Start the Express server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Error synchronizing Sequelize models with the database:",
      error
    );
  });
