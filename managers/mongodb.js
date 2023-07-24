const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://jcaldicote:AjyjxbrMSorOdvRn@clusterp7.k9tcdag.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

module.exports = mongoose;
