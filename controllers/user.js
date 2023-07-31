const bcrypt = require("bcrypt");
const User = require("../models/user.js");
const jwt = require("../managers/jwt.js");

exports.signUp = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
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
