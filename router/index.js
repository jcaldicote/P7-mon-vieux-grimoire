const express = require("express");

const indexCtrl = require("../controllers/index.js");
const router = express.Router();

router.post("/signup", indexCtrl.signUp);

module.exports = router;
