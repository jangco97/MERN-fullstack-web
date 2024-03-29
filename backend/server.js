const fs = require("fs");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const placeRoutes = require("./routes/placeRoutes");
const userRoutes = require("./routes/userRoutes");
const HttpError = require("./models/httpError");

const app = express();
app.use(cors());
// CORS Headers => Required for cross-origin/ cross-server communication

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, DELETE, OPTIONS"
//   );
//   next();
// });

app.use("/api/place", placeRoutes);
app.use("/api/user", userRoutes);

//라우팅 에러 처리
app.use((req, res, next) => {
  const error = new HttpError("올바르지 않은 경로로 요청을 보냈습니다..", 404);
  throw error;
});

//에러 핸들링
app.use((error, req, res, next) => {
  //multer가 에러를 던지면 파일을 삭제한다.
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "알수없는 에러가 발생했습니다." });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(5000); // start Node + Express server on port 5000
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(process.env.MONGODB_URI);
    console.log("connection failed");
  });
