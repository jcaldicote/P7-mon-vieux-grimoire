const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.get("/", welcome);
app.post("/api/auth/signup", signUp);

function welcome(req, res) {
  res.send(`*** Bienvenue sur le server Mon Vieux Grimoire ***`);
  console;
}

function signUp(req, res) {
  res.send("inscription OK");
}
module.exports = app;
