const express = require("express");
const ForumServices = require("../services/forum_services");
const router = express.Router();
const {
  uploadMultipleImage,
  uploadAnyImage,
} = require("../middlewares/fileUpload");

const validate = require("../middlewares/validate");
const errorHandler = require("../configs/error_handler_config");
const verifyToken = require("../middlewares/verify_token");

// const signUpSchema = require("../validators/user/signup_validator");
// const loginSchema = require("../validators/user/login_validator");

router.post(
  "/",
  verifyToken,
  uploadMultipleImage,
  //   validate(signUpSchema)
  errorHandler(ForumServices.create)
);
router.get("/find", errorHandler(ForumServices.searchVideo));
router.get("/get/:id", verifyToken, errorHandler(ForumServices.getForumInfo));
router.get("/", verifyToken, errorHandler(ForumServices.getAllForums));
router.delete("/", errorHandler(ForumServices.deleteForum));
router.get("/search", verifyToken, errorHandler(ForumServices.searchForum));

// FORUM TOPIC
router.get("/topic", errorHandler(ForumServices.getAllForumTopics));
router.post("/topic", errorHandler(ForumServices.createForumTopic));
router.put("/topic", errorHandler(ForumServices.updateForumTopic));

// SORTING
router.get(
  "/my-questions",
  verifyToken,
  errorHandler(ForumServices.getMyForums)
);
router.get(
  "/my-bookmarks",
  verifyToken,
  errorHandler(ForumServices.getMyBookmarks)
);
router.get(
  "/my-answers",
  verifyToken,
  errorHandler(ForumServices.getMyAnswers)
);
// BOOKMARK AND UNBOOKMARK
router.get("/bookmark", verifyToken, errorHandler(ForumServices.bookmarkForum));
router.delete(
  "/bookmark",
  verifyToken,
  errorHandler(ForumServices.unbookmarkForum)
);

// LIKE AND UNLIKE FORUM
router.get("/like", verifyToken, errorHandler(ForumServices.likeForum));
router.delete("/like", verifyToken, errorHandler(ForumServices.unLikeForum));
router.post(
  "/answer",
  verifyToken,
  uploadAnyImage,
  errorHandler(ForumServices.answerForum)
);

// LIKE AND UNLIKE FORUM REPLY
router.get(
  "/reply/like",
  verifyToken,
  errorHandler(ForumServices.likeForumReply)
);
router.delete(
  "/reply/like",
  verifyToken,
  errorHandler(ForumServices.unLikeForumReply)
);
router.post(
  "/reply/answer/:forumAnswerId/:userId/:content",
  verifyToken,
  errorHandler(ForumServices.replyAnswerForum)
);

router.get("/detail/:id", errorHandler(ForumServices.getAllDetails));
module.exports = router;
