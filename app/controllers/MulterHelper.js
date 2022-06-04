var path = require("path");
var multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(__base + "/public/uploads")) {
      fs.mkdirSync(path.normalize(__base + "/public/uploads"));
    }
    cb(null, path.normalize(__base + "/public/uploads"));
  },
  // filename: function (req, file, cb) {
  // 	console.log('file.fieldname :', file);

  // 	cb(null, Date.now() + '-' + file.originalname)
  // 	// cb(null, file.fieldname + '-' + Date.now())
  // }
});

module.exports.uploadSingleFile = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".xls" && ext !== ".xlsx") {
      return callback("Only Files are allowed");
    }
    callback(null, true);
  },
}).single("file");


module.exports.uploadImage = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".png" &&
      ext !== ".jpg" &&
      ext !== ".gif" &&
      ext !== ".jpeg" &&
      ext !== ".PNG" &&
      ext !== ".SVG" &&
      ext !== ".JPG" &&
      ext !== ".JPEG" &&
      ext !== ".svg" &&
      !file.mimetype.includes("image")
    ) {
      return callback("Only images are allowed");
    }
    callback(null, true);
  },
  // limits: {
  //   fileSize: 1024 * 1024 // Bytes
  // }
}).single("image");
