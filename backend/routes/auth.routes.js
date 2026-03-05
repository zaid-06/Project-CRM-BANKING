const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  register,
  login,
  verifyOtp,
  refreshAccessToken,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  loginWithPhone,
  verifyPhoneOtp,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth");


// ================= REGISTER =================
router.post(
  "/register",
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

    body("phone")
      .optional()
      .isLength({ min: 8, max: 20 })
      .withMessage("Phone must be between 8 and 20 characters"),
  ],
  register
);


// ================= LOGIN (STEP 1 - PASSWORD + OTP) =================
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("password")
      .notEmpty()
      .withMessage("Password is required"),

    body("userType")
      .notEmpty()
      .withMessage("User type is required"),
  ],
  login
);


// ================= VERIFY OTP =================
router.post(
  "/verify-otp",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email is required"),

    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  verifyOtp
);


// ================= LOGIN WITH PHONE (SEND OTP) =================
router.post(
  "/login-phone",
  [
    body("phone")
      .notEmpty()
      .withMessage("Phone is required"),
  ],
  loginWithPhone
);


// ================= VERIFY PHONE OTP =================
router.post(
  "/verify-otp-phone",
  [
    body("phone")
      .notEmpty()
      .withMessage("Phone is required"),

    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  verifyPhoneOtp
);


// ================= REFRESH TOKEN =================
router.post("/refresh-token", refreshAccessToken);


// ================= LOGOUT =================
router.post("/logout", protect, logout);


// ================= PROFILE =================
router.get("/profile", protect, getProfile);

router.put(
  "/profile",
  protect,
  [
    body("name").optional().trim(),
    body("phone").optional(),
    body("department").optional(),
  ],
  updateProfile
);


// ================= CHANGE PASSWORD =================
router.put(
  "/change-password",
  protect,
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),

    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  changePassword
);


module.exports = router;