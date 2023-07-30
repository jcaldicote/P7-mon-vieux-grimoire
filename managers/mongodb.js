const mongoose = require("mongoose");
require("dotenv").config({ path: "managers/.env" });

mongoose
  .connect(
    `mongodb+srv://${process.env.USERDB}:${process.env.PWDDB}@clusterp7.k9tcdag.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// const userSchema = new mongoose.Schema({
//   email: String,
//   password: String,
// });

// const user = mongoose.model("User", userSchema);

module.exports = { mongoose };
