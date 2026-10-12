const express = require("express");
const WaterTestService = require("../services/sample_service/water_test_services");
const router = express.Router();

const errorHandler = require("../configs/error_handler_config");

// Fish Test
router.get("/:user_id", errorHandler(WaterTestService.getAllWater));
router.get("/complex/", errorHandler(WaterTestService.getAllComplexWater));
router.post("/", errorHandler(WaterTestService.createWater));
router.put("/complete/:id", errorHandler(WaterTestService.completeWater));
router.put("/:id", errorHandler(WaterTestService.updateWater));
router.get("/:id", errorHandler(WaterTestService.getWater));
router.delete("/:id", errorHandler(WaterTestService.deleteWater));

module.exports = router;
