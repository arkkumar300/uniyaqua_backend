const express = require("express");
const TopicServices = require("../services/topic_service");
const router = express.Router();
const errorHandler = require("../configs/error_handler_config");
const verifyToken = require("../middlewares/verify_token");

router.post("/", errorHandler(TopicServices.createTopic));
router.get("/", errorHandler(TopicServices.getAllTopic));
router.delete("/:id", errorHandler(TopicServices.deleteTopic));
router.put("/:id", errorHandler(TopicServices.updateTopic));
router.get("/:id", errorHandler(TopicServices.getTopic));

module.exports = router;
