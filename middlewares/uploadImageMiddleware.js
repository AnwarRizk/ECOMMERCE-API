const multer = require("multer");
const apiError = require("../utils/apiError");

const multerOptions = () => {
  //Memory storage configuration for multer
  const multerStorage = multer.memoryStorage();

  // 3) File filter to allow only images
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Only image files are allowed!", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload;
};

exports.uploadSingleImage = (fieldName) => multerOptions().single(fieldName);

exports.uploadMixOfImages = (ArrayOfFields) =>
  multerOptions().fields(ArrayOfFields);
