const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

// File filter (Excel only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /xlsx|xls/;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only Excel (.xlsx, .xls) allowed!"),
      false
    );
  }
};

// Multer upload instance
const upload = multer({
  storage,
  limits: { fileSize: 9 * 1024 * 1024 }, // 9MB max size
  fileFilter,
});

// Error handler middleware
const handleUploadErrors = (fieldName) => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  };
};

// Export both
module.exports = { upload, handleUploadErrors };
