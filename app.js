const express = require("express");

const app = express();

app.use((req, res, next) => {
  console.log("requete reçu");
  next();
});
app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue !" });
});

module.exports = app;
