const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/generateToken");
const { validationResult } = require("express-validator");
const logActivity = require("../utils/activityLogger");
const { sendOtpSms } = require("../utils/smsService");


// ================= REGISTER =================
const register = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone, role, department } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "staff",
      department,
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      user.id,
      "REGISTER",
      "Auth",
      `User registered: ${user.name}`
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= LOGIN (PASSWORD CHECK, OPTIONAL OTP) =================
const login = async (req, res) => {
  try {

    const { email, password, userType } = req.body;

    let user = await User.findOne({ where: { email } });

    // Bootstrap default admin if not found and using default admin credentials
    const defaultAdminEmail = process.env.INIT_ADMIN_EMAIL || "admin@bankfinance.com";
    const defaultAdminPassword = process.env.INIT_ADMIN_PASSWORD || "admin123";

    if (
      !user &&
      email === defaultAdminEmail &&
      password === defaultAdminPassword &&
      userType === "admin"
    ) {
      user = await User.create({
        name: process.env.INIT_ADMIN_NAME || "Admin User",
        email: defaultAdminEmail,
        password: defaultAdminPassword,
        phone: process.env.INIT_ADMIN_PHONE || null,
        role: "admin",
        department: "Admin",
        status: "active",
      });
    }

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    if (user.role !== userType)
      return res.status(401).json({ message: "Invalid user type" });

    if (user.status !== "active")
      return res.status(401).json({ message: "Account is inactive" });

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const useOtp = process.env.AUTH_USE_OTP === "true";

    if (useOtp) {
      const otp = await user.generateOTP();
      console.log("OTP:", otp);
      return res.json({ message: "OTP sent successfully" });
    }

    const token = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await user.update({
      refreshToken,
      otp: null,
      otpExpires: null,
      lastLogin: new Date(),
    });

    await logActivity(
      user.id,
      "LOGIN",
      "Auth",
      "User logged in"
    );

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      department: user.department,
      token,
      refreshToken,
    });

  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= VERIFY OTP (FINAL LOGIN) =================
const verifyOtp = async (req, res) => {
  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (!user.verifyOTP(otp))
      return res.status(400).json({ message: "Invalid or expired OTP" });

    const token = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await user.update({
      refreshToken,
      otp: null,
      otpExpires: null,
      lastLogin: new Date(),
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      user.id,
      "LOGIN",
      "Auth",
      "User logged in"
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      department: user.department,
      token,
      refreshToken,
    });

  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= LOGIN WITH PHONE (SEND OTP) =================
const loginWithPhone = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(404).json({ message: "User not found for this phone number" });
    }

    if (user.status !== "active") {
      return res.status(401).json({ message: "Account is inactive" });
    }

    const otp = await user.generateOTP();
    const useRealSms = process.env.USE_REAL_SMS === "true";

    if (useRealSms) {
      try {
        await sendOtpSms(phone, otp);
      } catch (smsError) {
        console.error("Send OTP SMS Error:", smsError.message);
        // For demo, still allow login by exposing OTP in response
        return res.json({
          message: "OTP (SMS failed, using demo mode)",
          otp,
        });
      }
      return res.json({ message: "OTP sent successfully" });
    }

    // Demo mode: do not call any external SMS provider, just return OTP
    return res.json({
      message: "OTP generated (demo mode)",
      otp,
    });

  } catch (error) {
    console.error("Login with phone Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= VERIFY PHONE OTP (FINAL LOGIN) =================
const verifyPhoneOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP are required" });
    }

    const user = await User.findOne({ where: { phone } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    await user.update({
      refreshToken,
      otp: null,
      otpExpires: null,
      lastLogin: new Date(),
    });

    await logActivity(
      user.id,
      "LOGIN",
      "Auth",
      "User logged in via phone OTP"
    );

    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      department: user.department,
      token,
      refreshToken,
    });

  } catch (error) {
    console.error("Verify Phone OTP Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= REFRESH TOKEN =================
const refreshAccessToken = async (req, res) => {
  try {

    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(401).json({ message: "Refresh token required" });

    const decoded = verifyToken(refreshToken, true);

    const user = await User.findOne({
      where: { id: decoded.id, refreshToken },
    });

    if (!user)
      return res.status(401).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    await user.update({ refreshToken: newRefreshToken });

    res.json({
      token: newAccessToken,
      refreshToken: newRefreshToken,
    });

  } catch (error) {
    console.error("Refresh Token Error:", error.message);
    res.status(401).json({ message: "Invalid refresh token" });
  }
};



// ================= LOGOUT =================
const logout = async (req, res) => {
  try {

    await req.user.update({ refreshToken: null });

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "LOGOUT",
      "Auth",
      "User logged out"
    );

    res.json({ message: "Logged out successfully" });

  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= PROFILE =================
const getProfile = async (req, res) => {
  res.json(req.user);
};



// ================= UPDATE PROFILE =================
const updateProfile = async (req, res) => {
  try {

    const { name, phone, department } = req.body;

    await req.user.update({
      name: name || req.user.name,
      phone: phone || req.user.phone,
      department: department || req.user.department,
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "UPDATE",
      "Profile",
      "User profile updated"
    );

    res.json(req.user);

  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= CHANGE PASSWORD =================
const changePassword = async (req, res) => {
  try {

    const { currentPassword, newPassword } = req.body;

    const isPasswordValid = await req.user.validatePassword(currentPassword);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Current password incorrect" });

    req.user.password = newPassword;
    await req.user.save();

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "PASSWORD_CHANGE",
      "Auth",
      "User changed password"
    );

    res.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Change Password Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
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
};