const Book = require("../models/book.js");
const fs = require("fs");

exports.createBook = (req, res, next) => {
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

  thing
    .save()
    .then(() => {
      res.status(201).json({ message: "Livre enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((thing) => {
      res.status(200).json(thing);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
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

exports.getAllBook = (req, res, next) => {
  Book.find()
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getBestRatingBook = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((things) => {
      res.status(200).json(things);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.ratingBook = async (req, res, next) => {
  const _id = req.params.id;
  const rating = req.body.rating;
  const userId = req.auth.userId;
  const book = await Book.findOne({ _id });
  if (!book) return res.status(404).json({ error: "Book not found" });

  const ratingsRemote = book.ratings;
  const newRating = { userId: userId, grade: rating };
  const userRating = book.ratings.find((rating) => rating.userId === userId);
  if (userRating) return res.status(404).json({ error: "Book already noted" });

  ratingsRemote.push(newRating);

  const ratingsCount = book.ratings.length;
  const ratingsSum = book.ratings.reduce(
    (sum, rating) => sum + rating.grade,
    0
  );
  book.averageRating = ratingsSum / ratingsCount;

  await book.save();
  res.json(book);
  res.status(201).json({ message: "Note saved!" });
};
