const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");

const { protect, authorize } = require("../middleware/auth");


// ================= CREATE EMPLOYEE =================
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Employee name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("phone")
      .notEmpty()
      .withMessage("Phone number is required"),

    body("salary")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Salary must be a valid number"),

    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Status must be active or inactive"),
  ],
  createEmployee
);


// ================= GET ALL EMPLOYEES =================
router.get("/", protect, authorize("admin"), getAllEmployees);


// ================= GET SINGLE EMPLOYEE =================
router.get("/:id", protect, authorize("admin"), getEmployeeById);


// ================= UPDATE EMPLOYEE =================
router.put(
  "/:id",
  protect,
  authorize("admin"),
  [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Valid email is required"),

    body("salary")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Salary must be a valid number"),

    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Status must be active or inactive"),
  ],
  updateEmployee
);


// ================= DELETE EMPLOYEE =================
router.delete("/:id", protect, authorize("admin"), deleteEmployee);


module.exports = router;