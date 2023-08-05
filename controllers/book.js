const { restart } = require("nodemon");
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

exports.modifyBook = (req, res, next) => {
  const thingObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete thingObject._userId;
  Book.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...thingObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Livre modifié!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        const filename = thing.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Livre supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
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
const MSG_BOOK_NOTED = { message: "Notation enregistré!" };
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
  // res.json(book);
  res.status(201).json(MSG_BOOK_NOTED);
};

// Book.deleteMany({}).then(() => {
//   console.log("book collection deleted");
// });
