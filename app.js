const express = require("express");
const mongoose = require("mongoose");
const app = express();

mongoose
  .connect(
    "mongodb+srv://jcaldicote:AjyjxbrMSorOdvRn@clusterp7.k9tcdag.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const cors = require("cors");

app.use(cors());
app.use(express.json());
app.get("/", welcome);
app.post("/api/auth/signup", signUp);
app.post("/api/auth/log", logUser);

function welcome(req, res) {
  res.send(`*** Bienvenue sur le server Mon Vieux Grimoire ***`);
}

function signUp(req, res) {
  res.send("inscription OK");
}

function logUser(req, res) {
  const body = req.body;
  console.log("body content:", body);
}
module.exports = app;
