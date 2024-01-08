const express = require("express");
import mongoose from "mongoose";
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(bodyParser.json());

// CORS Headers => Required for cross-origin/ cross-server communication
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PATCH, DELETE, OPTIONS'
//   );
//   next();
// });

mongoose
  .connect(process.MONGODB_URL)
  .then(() => {
    app.listen(5000); // start Node + Express server on port 5000
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("connection failed");
  });
