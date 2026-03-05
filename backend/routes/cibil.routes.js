const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createCibil,
  getAllCibil,
  getCibilById,
  updateCibil,
  deleteCibil,
} = require("../controllers/cibil.controller");

const { protect } = require("../middleware/auth");


// ================= CREATE CIBIL =================
router.post(
  "/",
  protect,
  [
    body("clientId")
      .notEmpty()
      .withMessage("Client ID is required"),

    body("score")
      .isInt({ min: 300, max: 900 })
      .withMessage("CIBIL score must be between 300 and 900"),

    body("status")
      .optional()
      .isIn(["good", "average", "poor"])
      .withMessage("Status must be good, average, or poor"),
  ],
  createCibil
);


// ================= GET ALL CIBIL =================
router.get("/", protect, getAllCibil);


// ================= GET SINGLE CIBIL =================
router.get("/:id", protect, getCibilById);


// ================= UPDATE CIBIL =================
router.put(
  "/:id",
  protect,
  [
    body("score")
      .optional()
      .isInt({ min: 300, max: 900 })
      .withMessage("CIBIL score must be between 300 and 900"),

    body("status")
      .optional()
      .isIn(["good", "average", "poor"])
      .withMessage("Status must be good, average, or poor"),
  ],
  updateCibil
);


// ================= DELETE CIBIL =================
router.delete("/:id", protect, deleteCibil);


module.exports = router;