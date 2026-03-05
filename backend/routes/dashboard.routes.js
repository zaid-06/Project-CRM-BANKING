const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getMonthlyPerformance,
} = require("../controllers/dashboard.controller");

const { protect } = require("../middleware/auth");

// ================= GET DASHBOARD STATS =================
router.get("/", protect, getDashboardStats);

// ================= GET MONTHLY PERFORMANCE =================
router.get("/monthly-performance", protect, getMonthlyPerformance);

module.exports = router;