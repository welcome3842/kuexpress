const multer = require("multer");
const path = require("path");


const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});


const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      return cb(new Error("Only images (jpeg, jpg, png, gif) are allowed"));
    }
  },
});


class UploadController {
  static uploadImage(req, res) {
    upload.single("image")(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        
        return res.status(400).json({ error: true, file: "", message: "File upload error: " + err.message });
      } else if (err) {
        
        return res.status(400).json({ error: true, file: "", message: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: true, file: "", message: "No file uploaded" });
      }
      
      res.status(200).json({ error: false, file: "uploads/" + req.file.filename });
    });
  }
}

module.exports = UploadController;
