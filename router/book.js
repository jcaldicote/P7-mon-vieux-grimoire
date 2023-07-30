const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.js");

const bookCtrl = require("../controllers/book.js");

router.get("/", auth, bookCtrl.getAllBook);
router.post("/", auth, bookCtrl.createBook);
router.get("/:id", auth, bookCtrl.getOneBook);
router.put("/:id", auth, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
