const express = require("express");
const labAssistant_services = require("../services/labAssistant_services");
const router = express.Router();
const errorHandler = require("../configs/error_handler_config");
const verifyToken = require("../middlewares/verify_token");

router.post("/create",  errorHandler(labAssistant_services.create));
router.get("/", errorHandler(labAssistant_services.getAllAssistants));
router.get("/pending/", errorHandler(labAssistant_services.getPendingAssistants));
router.get("/:id", errorHandler(labAssistant_services.getAssistant));
router.delete("/:id", errorHandler(labAssistant_services.deleteAssistant));
router.put("/:id", errorHandler(labAssistant_services.updateAssistant));

module.exports = router;
