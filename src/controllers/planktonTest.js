const express = require("express");
const PlanktonService = require("../services/sample_service/plankton_test_services");
const router = express.Router();

const errorHandler = require("../configs/error_handler_config");

// Feed Test
router.get("/", errorHandler(PlanktonService.getAllPlankton));
router.get("/complex", errorHandler(PlanktonService.getAllComplexPlankton));
router.post("/", errorHandler(PlanktonService.createPlankton));
router.get(
  "/completed/:id",
  errorHandler(PlanktonService.getCompletePlanktonWithID)
);
router.put("/completed/:id", errorHandler(PlanktonService.completePlankton));
router.put("/:id", errorHandler(PlanktonService.updatePlankton));
router.get("/:id", errorHandler(PlanktonService.getPlankton));
router.delete("/:id", errorHandler(PlanktonService.deletePlankton));

module.exports = router;
