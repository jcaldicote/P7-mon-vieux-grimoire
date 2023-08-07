const book = require("../models/book.js");
const Book = require("../models/book.js");
const fs = require("fs");

const MSG_BOOK_SAVED = { message: "Livre enregistré !" };
exports.createBook = async (req, res, next) => {
  const thingObject = JSON.parse(req.body.book);
  delete thingObject._id;
  delete thingObject._userId;
  const thing = new Book({
    ...thingObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  const createNewBook = await thing.save();
  if (!createNewBook) return res.status(400).json({ error });
  res.status(201).json(MSG_BOOK_SAVED);
};

const ERR_BOOK_NOT_AVAILABLE = { error: "Livre pas disponible" };
exports.getOneBook = async (req, res, next) => {
  const oneBookRequest = await Book.findOne({ _id: req.params.id });
  if (!oneBookRequest) return res.status(404).json(ERR_BOOK_NOT_AVAILABLE);
  res.status(200).json(oneBookRequest);
};

const MSG_NOT_AUTHORIZED = { message: "Pas le droit de modifié" };
const ERR_BOOK_CHANGING = { error: "erreur modification du livre" };
const MSG_BOOK_CHANGED = { message: "Livre modifié !" };
exports.modifyBook = async (req, res, next) => {
  try {
    const thingObject = req.file
      ? {
          ...JSON.parse(req.body.book),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            req.file.filename
          }`,
        }
      : { ...req.body };
    delete thingObject._userId;

    const idUrl = req.params.id;
    const thing = await Book.findOne({ _id: idUrl });
    if (thing.userId !== req.auth.userId)
      return res.status(401).json(MSG_NOT_AUTHORIZED);

    await Book.updateOne({ _id: idUrl }, { ...thingObject, _id: idUrl });
    res.status(200).json(MSG_BOOK_CHANGED);
  } catch (error) {
    console.error(error);
    res.status(400).json(ERR_BOOK_CHANGING);
  }
};

exports.deleteBook = async (req, res, next) => {
  const findBook = await Book.findOne({ _id: req.params.id });

  if (findBook.userId != req.auth.userId) {
    res.status(401).json({ message: "Not authorized" });
  } else {
    const filename = findBook.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, () => {
      Book.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({ message: "Livre supprimé !" });
        })
        .catch((error) => res.status(401).json({ error }));
    });
  }
};

const ERR_BOOKS_ARENOT_AVAILABLE = { error: "Les livres sont pas disponibles" };
exports.getAllBook = async (req, res, next) => {
  const allBookRequest = await Book.find();
  if (!allBookRequest) return res.status(400).json(ERR_BOOKS_ARENOT_AVAILABLE);
  res.status(200).json(allBookRequest);
};

const ERR_BEST_RATING_BOOKS = { error: "Erreur sur la requête" };
exports.getBestRatingBook = async (req, res, next) => {
  const bestRatingBookRequest = await Book.find()
    .sort({ averageRating: -1 })
    .limit(3);
  if (!bestRatingBookRequest)
    return res.status(400).json(ERR_BEST_RATING_BOOKS);
  res.status(200).json(bestRatingBookRequest);
};

const ERR_BOOK_NOT_FOUND = { error: "Livre non trouvé" };
const ERR_BOOK_ALREADY_NOTED = { error: "Livre déjà noté" };

exports.ratingBook = async (req, res, next) => {
  const _id = req.params.id;
  const rating = req.body.rating;
  const userId = req.auth.userId;
  const book = await Book.findOne({ _id });
  if (!book) return res.status(404).json(ERR_BOOK_NOT_FOUND);

  const ratingsRemote = book.ratings;
  const newRating = { userId: userId, grade: rating };
  const userRating = book.ratings.find((rating) => rating.userId === userId);
  if (userRating) return res.status(404).json(ERR_BOOK_ALREADY_NOTED);

  ratingsRemote.push(newRating);

  const ratingsCount = book.ratings.length;
  const ratingsSum = book.ratings.reduce(
    (sum, rating) => sum + rating.grade,
    0
  );
  book.averageRating = (ratingsSum / ratingsCount).toFixed(2);

  await book.save();
  res.status(201).json(book);
};

// Book.deleteMany({}).then(() => {
//   console.log("book collection deleted");
// });
