const express = require("express");
const FishTestService = require("../services/sample_service/fish_test_services");
const router = express.Router();

const errorHandler = require("../configs/error_handler_config");

// Fish Test
router.get("/:user_id", errorHandler(FishTestService.getAllFish));
router.get("/complex/", errorHandler(FishTestService.getAllComplexFish));
router.get("/:id", errorHandler(FishTestService.getFish));
router.post("/", errorHandler(FishTestService.createFish));
router.put("/complete/:id", errorHandler(FishTestService.completeFish));
router.put("/:id", errorHandler(FishTestService.updateFish));
router.delete("/:id", errorHandler(FishTestService.deleteFish));

module.exports = router;