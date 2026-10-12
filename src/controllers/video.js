const express = require("express");
const VideoServices = require("../services/video_services");
const router = express.Router();
const { uploadImage,uploadPDF,uploadBookandCover } = require("../middlewares/fileUpload");
const errorHandler = require("../configs/error_handler_config");
const verifyToken = require("../middlewares/verify_token");

router.post(
  "/",
  verifyToken,
  uploadImage,
  //   validate(signUpSchema)
  errorHandler(VideoServices.create)
);
router.get("/", errorHandler(VideoServices.getAllVideo));
router.get("/search", errorHandler(VideoServices.searchVideo));
router.get("/:id", errorHandler(VideoServices.getVideo));
router.delete("/", errorHandler(VideoServices.deleteVideo));
router.put("/", errorHandler(VideoServices.updateVideo));
router.put("/:id",errorHandler(VideoServices.inactiveVideo))

module.exports = router;
