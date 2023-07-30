const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user.js");

router.post("/signup", userCtrl.signUp);
router.post("/login", userCtrl.login);

module.exports = router;
