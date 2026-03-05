const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue
} = require("../controllers/issue.controller");

const { protect } = require("../middleware/auth");


// ================= CREATE ISSUE =================
router.post(
  "/",
  protect,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Issue title is required"),

    body("description")
      .trim()
      .notEmpty()
      .withMessage("Issue description is required"),

    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "critical"])
      .withMessage("Invalid priority level")
  ],
  createIssue
);


// ================= GET ALL ISSUES =================
router.get("/", protect, getIssues);


// ================= GET SINGLE ISSUE =================
router.get("/:id", protect, getIssueById);


// ================= UPDATE ISSUE =================
router.put(
  "/:id",
  protect,
  [
    body("priority")
      .optional()
      .isIn(["low", "medium", "high", "critical"])
      .withMessage("Invalid priority level"),

    body("status")
      .optional()
      .isIn(["open", "in-progress", "resolved", "closed"])
      .withMessage("Invalid status")
  ],
  updateIssue
);


// ================= DELETE ISSUE =================
router.delete("/:id", protect, deleteIssue);


module.exports = router;