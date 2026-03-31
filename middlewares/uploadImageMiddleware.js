const multer = require("multer");
const apiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  // 1) Disk storage configuration for multer
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = file.mimetype.split("/")[1];
  //     cb(null, `category-${uuidv4()}-${Date.now()}.${ext}`);
  //   },
  // });

  // 2) Memory storage configuration for multer
  const multerStorage = multer.memoryStorage();

  // 3) File filter to allow only images
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else {
      cb(new apiError("Not an image! Please upload only images.", 400), false);
    }
  };

  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};
