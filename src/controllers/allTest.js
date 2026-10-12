const express = require("express");
const AllTestService = require("../services/sample_service/all_test_services");
const router = express.Router();

const errorHandler = require("../configs/error_handler_config");

router.get("/report/:userId", errorHandler(AllTestService.getAllReportingTest));
router.get(
  "/complete/:userId/:date",
  errorHandler(AllTestService.getAllCompleteTest)
);
router.get(
  "/complete",
  errorHandler(AllTestService.getAllCompleteTestForAdmin)
);
router.get(
  "/forgivelab",
  errorHandler(AllTestService.getAllCompleteForGivenLab)
);
router.get("/:userId", errorHandler(AllTestService.getAllTest));
router.post("/:farmerId", errorHandler(AllTestService.createTest));
router.put("/approve/:id", errorHandler(AllTestService.approveTest));
router.put("/complete/:id", errorHandler(AllTestService.completeTest));
router.put("/:id", errorHandler(AllTestService.updateTest));
router.get("/:id", errorHandler(AllTestService.getTest));
router.delete("/:id", errorHandler(AllTestService.deleteTest));

module.exports = router;
