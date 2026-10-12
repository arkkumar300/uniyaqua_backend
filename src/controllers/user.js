const express = require("express");
const UserServices = require("../services/user_services");
const router = express.Router();

const validate = require("../middlewares/validate");
const errorHandler = require("../configs/error_handler_config");
const verifyToken = require("../middlewares/verify_token");
const {
  uploadMultipleImage,
  uploadMultipleLabImage,
  getUploadSignedUrl,
  getReadSignedUrl,
} = require("../middlewares/fileUpload");

router.post(
  "/signup",
  uploadMultipleLabImage,(err, req, res, next) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ message: err.message });
    }
    next();
  },
  errorHandler(UserServices.signUp)
);
router.post("/login", errorHandler(UserServices.login));
router.post('/send-otp', errorHandler(UserServices.sendOTP));
router.post('/verify-otp', errorHandler(UserServices.verifyOTP));
router.post('/resend-otp', errorHandler(UserServices.resendOTP));
router.get("/", verifyToken, errorHandler(UserServices.userProfile));
router.get("/get/:id", errorHandler(UserServices.findUser));
router.post("/forgot", errorHandler(UserServices.changePassword));
router.get("/all", errorHandler(UserServices.getAllUsers));
router.post(
  "/change",
  verifyToken,
  errorHandler(UserServices.changeUserStatus)
);
router.put("/approve/:id", verifyToken, errorHandler(UserServices.approveUser));
router.put("/update/:id",uploadMultipleLabImage, errorHandler(UserServices.updateUser));
router.put("/logout/:id", errorHandler(UserServices.logout));
// router.post(
//   "/transaction",
//   verifyToken,
//   errorHandler(UserServices.userTransaction)
// );
router.delete("/delete/:id", errorHandler(UserServices.deleteUser));

/*
|--------------------------------------------------------------------------
| signed uploaded file
|--------------------------------------------------------------------------
|
| SIGNED /upload/:filename
|
| IMPORTANT:
| The filename should be the GCS object path.
|
| Example:
| documents/abc-123.pdf
*/

router.post('/signed-url',
  async (req, res) => {
    try {
      const { fileName, mimeType, fileType = 'image' } = req.body;

      if (!fileName || !mimeType) {
        return res
          .status(400)
          .json({ error: 'fileName and mimeType are required' });
      }

      let subFolder = 'images';
      let maxSizeBytes = 10 * 1024 * 1024; // 10 MB for images

      if (fileType === 'document' || mimeType === 'application/pdf') {
        subFolder = 'documents';
        maxSizeBytes = 25 * 1024 * 1024;   // 25 MB for documents
      }

      const result = await getUploadSignedUrl(
        fileName,
        mimeType,
        subFolder,
        maxSizeBytes
      );

      res.status(200).json({
        success: true,
        data: {
          uploadUrl: result.url,
          filePath: result.filePath,
          fullUrl: result.fullUrl,
          requiredHeaders: result.requiredHeaders,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  /*
|--------------------------------------------------------------------------
| get signed uploaded file
|--------------------------------------------------------------------------
|
| SIGNED /upload/:filename
|
| IMPORTANT:
| The filename should be the GCS object path.
|
| Example:
| documents/abc-123.pdf
*/

router.get('/signed-read',
  async (req, res) => {
    try {
      const { path: filePath } = req.query;
      if (!filePath) {
        return res.status(400).json({ error: 'path query param is required' });
      }

      const url = await getReadSignedUrl(filePath, 60 * 60 * 1000); // 1 hour

      res.json({
        success: true,
        data: { url, expiresIn: 3600 },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router;
