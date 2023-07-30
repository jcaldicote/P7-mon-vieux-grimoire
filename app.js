const express = require("express");
const { mongoose } = require("./managers/mongodb.js");
const app = express();
const userRoutes = require("./router/user.js");
const bookRoutes = require("./router/book.js");

const cors = require("cors");

app.use(cors());
app.use(express.json());
// app.get("/", welcome);
// app.post("/api/auth/signup", signUp);
// app.post("/api/auth/log", logUser);

// function welcome(req, res) {
//   res.send(`*** Bienvenue sur le server Mon Vieux Grimoire ***`);
// }

// function signUp(req, res) {
//   res.send("inscription OK");
// }

// function logUser(req, res) {
//   const body = req.body;
//   console.log("body content:", body);
// }

app.use("/api/auth", userRoutes);
app.use("/api/books", bookRoutes);

module.exports = app;
