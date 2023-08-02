const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.js");
const multer = require("../middlewares/multer-config.js");

const bookCtrl = require("../controllers/book.js");

router.get("/", bookCtrl.getAllBook);
router.get("/bestrating", bookCtrl.getBestRatingBook);
router.post("/", auth, multer, bookCtrl.createBook);
router.get("/:id", bookCtrl.getOneBook);
router.post("/:id/rating", auth, bookCtrl.ratingBook);
router.put("/:id", auth, multer, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
