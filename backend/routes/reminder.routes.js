const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  markAsCompleted,
} = require("../controllers/reminder.controller");

const { protect } = require("../middleware/auth");


// All reminder routes protected
router.use(protect);


// ================= CREATE REMINDER =================
router.post(
  "/",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),

    body("reminderDate")
      .notEmpty()
      .withMessage("Reminder date is required")
      .isISO8601()
      .withMessage("Valid date format required"),

    body("type")
      .optional()
      .isIn(["call", "meeting", "follow-up"])
      .withMessage("Invalid reminder type"),

    body("status")
      .optional()
      .isIn(["pending", "completed", "cancelled"])
      .withMessage("Invalid status"),
  ],
  createReminder
);


// ================= GET ALL REMINDERS =================
router.get("/", getAllReminders);


// ================= GET SINGLE REMINDER =================
router.get("/:id", getReminderById);


// ================= UPDATE REMINDER =================
router.put(
  "/:id",
  [
    body("reminderDate")
      .optional()
      .isISO8601()
      .withMessage("Valid date format required"),

    body("status")
      .optional()
      .isIn(["pending", "completed", "cancelled"])
      .withMessage("Invalid status"),
  ],
  updateReminder
);


// ================= MARK AS COMPLETED =================
router.put("/:id/complete", markAsCompleted);


// ================= DELETE REMINDER =================
router.delete("/:id", deleteReminder);


module.exports = router;