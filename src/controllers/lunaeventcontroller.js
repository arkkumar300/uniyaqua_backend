const express = require("express");
const LunaServices = require("../services/lunaservice");
const errorHandler = require("../configs/error_handler_config");

const router = express.Router();
router.get("/", errorHandler(LunaServices.getLunarEvents));
router.get("/next", errorHandler(LunaServices.getNextLunarEvent));
router.post("/", errorHandler(LunaServices.createLunarEvent));
router.put("/:Id", errorHandler(LunaServices.updateLunarEvent));
router.delete("/:id", errorHandler(LunaServices.deleteLunarEvent));

module.exports = router;
