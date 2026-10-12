const express = require("express");
const EmployerController = require("../services/employerService");
const errorHandler = require("../configs/error_handler_config");

const router = express.Router();

router.get("/", errorHandler(EmployerController.fetchEmployersWithRoles)); // Fetch employers and their roles
router.post("/", errorHandler(EmployerController.addEmployer)); 
router.put("/:id", errorHandler(EmployerController.updateEmployer)); 
router.delete("/:id", errorHandler(EmployerController.removeEmployer)); 
router.put(
  "/:employerId/roles",
  errorHandler(EmployerController.updateEmployerRoles)
);
router.get("/roles", errorHandler(EmployerController.fetchRoles)) 

module.exports = router;
