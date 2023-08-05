const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const jwt = require("../managers/jwt.js");

const MSG_USER_CREATED = { message: "Utilisateur créé !" };
const ERR_USER_CREATED = { error: "Problème durant la création du compte" };
exports.signUp = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      email: req.body.email,
      password: hash,
    });

    const userSave = await user.save();
    if (!userSave) return res.status(400).json({ error });
    res.status(201).json(MSG_USER_CREATED);
  } catch (error) {
    console.error(error);
    res.status(500).json(ERR_USER_CREATED);
  }
};

const ERR_USER_NOT_FOUND = { error: "Utilisateur non trouvé !" };
const ERR_BAD_PWD = { error: "Mot de passe incorrect !" };
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json(ERR_USER_NOT_FOUND);
  const { _id: userId, password: hash } = user;

  const valid = await bcrypt.compare(password, hash);
  if (!valid) return res.status(401).json(ERR_BAD_PWD);

  res.status(200).json({ userId, token: jwt.sign({ userId }) });
};

// User.deleteMany({}).then(() => {
//   console.log("User collection deleted");
// });
