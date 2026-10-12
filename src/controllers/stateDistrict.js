const express = require("express");
const BookServices = require("../services/stateDistrict_services");
const router = express.Router();

const errorHandler = require("../configs/error_handler_config");
const verifyToken = require("../middlewares/verify_token");

router.post(
  "/state",
  errorHandler(BookServices.createState)
);
router.get("/state/find/:id", errorHandler(BookServices.getAllDistrictFromState));
router.get("/state", errorHandler(BookServices.getAllState));
router.get("/state/:id", errorHandler(BookServices.getState));
router.delete("/state/:id", errorHandler(BookServices.deleteState));
router.put("/state/:id", 
errorHandler(BookServices.updateState));

router.post("/district", errorHandler(BookServices.createDistrict));
router.get("/district", errorHandler(BookServices.getAllDistrict));
router.get("/district/:id", errorHandler(BookServices.getDistrict));
router.delete("/district/:id", errorHandler(BookServices.deleteDistrict));
router.put("/district/:id", errorHandler(BookServices.updateDistrict));

module.exports = router;
