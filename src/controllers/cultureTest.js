const express = require("express");
const CultureTestService = require("../services/sample_service/culture_test_services");
const router = express.Router();

const errorHandler = require("../configs/error_handler_config");

// Culture Test
router.get("/:user_id", errorHandler(CultureTestService.getAllCulture));
router.post("/", errorHandler(CultureTestService.createCulture));
router.put("/complete/:id", errorHandler(CultureTestService.completeCulture));
router.put("/:id", errorHandler(CultureTestService.updateCulture));
router.get("/complex", errorHandler(CultureTestService.getAllComplexCulture));
router.get("/:id", errorHandler(CultureTestService.getCulture));
router.delete("/:id", errorHandler(CultureTestService.deleteCulture));

module.exports = router;
