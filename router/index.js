const express = require("express");

const router = express.Router();

router.post("/signup", signUp);

function signUp(req, res) {
  res.send("inscription OK");
}

module.exports = router;
