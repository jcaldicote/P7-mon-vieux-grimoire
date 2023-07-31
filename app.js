const express = require("express");
require("express-async-errors");
const { mongoose } = require("./managers/mongodb.js");
const app = express();
const userRoutes = require("./router/user.js");
const bookRoutes = require("./router/book.js");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(function (err, req, res, next) {
  console.error(err);
  res.status().send("internal server error");
});
module.exports = app;
