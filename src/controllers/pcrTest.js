const express = require("express");
const PCRTestService = require("../services/sample_service/pcr_test_services");
const router = express.Router();

const errorHandler = require("../configs/error_handler_config");

// PCR Test
router.get("/:user_id", errorHandler(PCRTestService.getAllPCR));
router.post("/", errorHandler(PCRTestService.createPCR));
router.put("/complete/:id", errorHandler(PCRTestService.completePCR));
router.put("/:id", errorHandler(PCRTestService.updatePCR));
router.get("/complex", errorHandler(PCRTestService.getAllComplexPCR));
router.get("/:id", errorHandler(PCRTestService.getPCR));
router.delete("/:id", errorHandler(PCRTestService.deletePCR));

module.exports = router;
