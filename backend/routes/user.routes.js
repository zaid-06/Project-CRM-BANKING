const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserStatus,
} = require("../controllers/user.controller");

const { protect, authorize } = require("../middleware/auth");


// All routes protected
router.use(protect);


// ================= GET ALL USERS =================
// Admin only
router.get(
  "/",
  authorize("admin"),
  getAllUsers
);


// ================= GET SINGLE USER =================
// Admin only
router.get(
  "/:id",
  authorize("admin"),
  getUserById
);


// ================= CREATE USER =================
// Admin only
router.post(
  "/",
  authorize("admin"),
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),

    body("role")
      .isIn(["admin", "manager", "staff", "franchise"])
      .withMessage("Invalid role"),
  ],
  createUser
);


// ================= UPDATE USER =================
// Admin only
router.put(
  "/:id",
  authorize("admin"),
  [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Valid email required"),

    body("role")
      .optional()
      .isIn(["admin", "manager", "staff", "franchise"])
      .withMessage("Invalid role"),

    body("status")
      .optional()
      .isIn(["active", "inactive"])
      .withMessage("Invalid status"),
  ],
  updateUser
);


// ================= UPDATE USER STATUS =================
// Admin only
router.put(
  "/:id/status",
  authorize("admin"),
  [
    body("status")
      .isIn(["active", "inactive"])
      .withMessage("Invalid status value"),
  ],
  updateUserStatus
);


// ================= DELETE USER =================
// Admin only
router.delete(
  "/:id",
  authorize("admin"),
  deleteUser
);


module.exports = router;