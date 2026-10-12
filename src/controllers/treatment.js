const express = require("express");
const TreatmentService = require("../services/treatment_services");
const router = express.Router();
const {
  uploadMultipleImage,
  uploadImage,
} = require("../middlewares/fileUpload");

const errorHandler = require("../configs/error_handler_config");
const verifyToken = require("../middlewares/verify_token");

// SECTOR
router.post(
  "/sector",
  uploadImage,
  errorHandler(TreatmentService.createSector)
);
router.get("/sector", errorHandler(TreatmentService.getAllSectors));
router.put("/sector/:id", errorHandler(TreatmentService.updateSector));
router.delete("/sector/:id", errorHandler(TreatmentService.deleteSector));

router.get(
  "/find/sector/:id",
  errorHandler(TreatmentService.getTreatmentBySector)
);
// PROBLEM
router.post("/problem", errorHandler(TreatmentService.createProblem));
router.get("/problem", errorHandler(TreatmentService.getAllProblems));
router.get(
  "/problem/sector/:id",
  errorHandler(TreatmentService.getProblemBySector)
);
router.delete("/problem/:id", errorHandler(TreatmentService.deleteProblem));

// TREATMENT
router.post(
  "/",
  verifyToken,
  uploadMultipleImage,
  errorHandler(TreatmentService.createTreatment)
);
router.put(
  "/:treatmentId",
  verifyToken,
  uploadMultipleImage,
  errorHandler(TreatmentService.updateTreatment)
);
router.get("/", errorHandler(TreatmentService.getAllTreatments));
router.get(
  "/import",
  verifyToken,
  errorHandler(TreatmentService.importTreatment)
);
router.get("/:status", errorHandler(TreatmentService.getAllTreatmentsForAdmin));

router.delete("/:id", errorHandler(TreatmentService.deleteTreatment));

router.get(
  "/my/sector/:id",
  verifyToken,
  errorHandler(TreatmentService.getMyTreatmentBySector)
);
router.get("/my", verifyToken, errorHandler(TreatmentService.findMyTreatments));
router.get("/:problemId", errorHandler(TreatmentService.getTreatments));
router.post(
  "/farmer",
  verifyToken,
  errorHandler(TreatmentService.createTreatmentFramer)
);
router.get("/farmer/all", errorHandler(TreatmentService.getAllFarmers));
router.get("/farmer/:id", errorHandler(TreatmentService.getFarmers));

router.get(
  "/farmer/problem/:id",
  errorHandler(TreatmentService.getProblemByFarmer)
);

router.put("/farmer/:id", errorHandler(TreatmentService.approveFarmer));
router.delete("/farmer/:id", errorHandler(TreatmentService.deleteFarmer));

module.exports = router;
