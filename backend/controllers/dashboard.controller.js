const { Op } = require("sequelize");
const Lead = require("../models/Lead");
const Client = require("../models/Client");
const User = require("../models/User");
const Reminder = require("../models/Reminder");
const KYC = require("../models/KYC");

// ================= DASHBOARD STATS =================
const getDashboardStats = async (req, res) => {
  try {
    // For admin show global stats, for staff show only own/assigned records
    const isAdmin = req.user.role === "admin";

    const leadFilter = isAdmin
      ? {}
      : {
          [Op.or]: [
            { createdBy: req.user.id },
            { assignedTo: req.user.id },
          ],
        };

    const clientFilter = isAdmin ? {} : { assignedTo: req.user.id };

    const totalLeads = await Lead.count({ where: leadFilter });
    const totalClients = await Client.count({ where: clientFilter });

    // Employees: count active staff and managers from users table
    const employeeFilter = {
      role: { [Op.in]: ["manager", "staff"] },
      status: "active",
    };
    const totalEmployees = await User.count({ where: employeeFilter });

    const today = new Date().toISOString().split("T")[0];

    const todayReminders = await Reminder.count({
      where: { date: today },
    });

    const kycPending = await KYC.count({
      where: { status: "pending" },
    });

    const kycCompleted = await KYC.count({
      where: { status: "completed" },
    });

    res.json({
      totalLeads,
      totalClients,
      totalEmployees,
      todayReminders,
      kycPending,
      kycCompleted,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= MONTHLY PERFORMANCE (LEADS & CONVERSIONS) =================
const getMonthlyPerformance = async (req, res) => {
  try {
    const isAdmin = req.user.role === "admin";

    const baseLeadFilter = isAdmin
      ? {}
      : {
          [Op.or]: [
            { createdBy: req.user.id },
            { assignedTo: req.user.id },
          ],
        };

    const now = new Date();
    const months = [];
    const leads = [];
    const conversions = [];

    // Last 6 months including current
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
      const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);

      const monthLabel = monthDate.toLocaleString("default", { month: "short" }); // Jan, Feb, ...
      months.push(monthLabel);

      const leadWhere = {
        ...baseLeadFilter,
        createdAt: { [Op.between]: [startOfMonth, endOfMonth] },
      };

      const convertedWhere = {
        ...baseLeadFilter,
        status: "Converted",
        updatedAt: { [Op.between]: [startOfMonth, endOfMonth] },
      };

      const leadCount = await Lead.count({ where: leadWhere });
      const convertedCount = await Lead.count({ where: convertedWhere });

      leads.push(leadCount);
      conversions.push(convertedCount);
    }

    res.json({
      months,
      leads,
      conversions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getDashboardStats,
  getMonthlyPerformance,
};