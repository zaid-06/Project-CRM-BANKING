const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
} = require("../controllers/lead.controller");

const { protect, authorize } = require("../middleware/auth");


// All routes protected
router.use(protect);


// ================= GET ALL LEADS =================
router.get("/", getLeads);


// ================= LEAD STATS =================
router.get("/stats", getLeadStats);


// ================= GET SINGLE LEAD =================
router.get("/:id", getLeadById);


// ================= CREATE LEAD =================
router.post(
  "/",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("phone")
      .notEmpty()
      .withMessage("Phone is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("source")
      .optional()
      .trim(),

    body("status")
      .optional()
      .isIn(["New", "Contacted", "Follow-up", "Converted", "Rejected"])
      .withMessage("Invalid status"),
  ],
  createLead
);


// ================= UPDATE LEAD =================
router.put(
  "/:id",
  [
    body("name").optional().trim(),
    body("email").optional().isEmail().withMessage("Valid email required"),
    body("status")
      .optional()
      .isIn(["New", "Contacted", "Follow-up", "Converted", "Rejected"])
      .withMessage("Invalid status"),
  ],
  updateLead
);


// ================= DELETE LEAD =================
// Any authenticated user can delete their leads
router.delete("/:id", deleteLead);


module.exports = router;