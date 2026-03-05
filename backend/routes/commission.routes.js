const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createCommission,
  getAllCommissions,
  getCommissionById,
  updateCommission,
  deleteCommission,
} = require("../controllers/commission.controller");

const { protect } = require("../middleware/auth");


// ================= CREATE COMMISSION =================
router.post(
  "/",
  protect,
  [
    body("clientId")
      .notEmpty()
      .withMessage("Client ID is required"),

    body("amount")
      .isFloat({ min: 0 })
      .withMessage("Amount must be a valid number"),

    body("percentage")
      .isFloat({ min: 0, max: 100 })
      .withMessage("Percentage must be between 0 and 100"),

    body("type")
      .notEmpty()
      .withMessage("Commission type is required"),

    body("status")
      .optional()
      .isIn(["pending", "paid"])
      .withMessage("Status must be pending or paid"),
  ],
  createCommission
);


// ================= GET ALL COMMISSIONS =================
router.get("/", protect, getAllCommissions);


// ================= GET SINGLE COMMISSION =================
router.get("/:id", protect, getCommissionById);


// ================= UPDATE COMMISSION =================
router.put(
  "/:id",
  protect,
  [
    body("amount")
      .optional()
      .isFloat({ min: 0 })
      .withMessage("Amount must be a valid number"),

    body("percentage")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("Percentage must be between 0 and 100"),

    body("status")
      .optional()
      .isIn(["pending", "paid"])
      .withMessage("Status must be pending or paid"),
  ],
  updateCommission
);


// ================= DELETE COMMISSION =================
router.delete("/:id", protect, deleteCommission);


module.exports = router;