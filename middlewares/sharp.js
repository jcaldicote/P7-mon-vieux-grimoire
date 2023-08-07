const fs = require("fs");
const sharp = require("sharp");

const sharpImage = async (req, res, next) => {
  try {
    if (req.method === "PUT" && !req.file) return next();
    if (!req.file) throw "Any upload file !!!";
    const maxWidth = 800;
    const maxHeight = 600;

    const buffer = await sharp(req.file.path)
      .resize(maxWidth, maxHeight, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();

    await fs.promises.unlink(req.file.path);
    await fs.promises.writeFile(`images/${req.file.filename}`, buffer);

    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports = sharpImage;
