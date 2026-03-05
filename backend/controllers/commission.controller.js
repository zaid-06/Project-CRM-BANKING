const { validationResult } = require("express-validator");
const Commission = require("../models/Commission");


// ================= CREATE COMMISSION =================
const createCommission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, amount, percentage, type, status, remarks } = req.body;

    // Auto calculate commission
    const commissionAmount = (amount * percentage) / 100;

    const newCommission = await Commission.create({
      clientId,
      amount,
      percentage,
      commissionAmount,
      type,
      status: status || "pending",
      remarks,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Commission created successfully",
      data: newCommission,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET ALL COMMISSIONS =================
const getAllCommissions = async (req, res) => {
  try {
    const commissions = await Commission.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(commissions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE COMMISSION =================
const getCommissionById = async (req, res) => {
  try {
    const commission = await Commission.findByPk(req.params.id);

    if (!commission) {
      return res.status(404).json({ message: "Commission not found" });
    }

    res.json(commission);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE COMMISSION =================
const updateCommission = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const commission = await Commission.findByPk(req.params.id);

    if (!commission) {
      return res.status(404).json({ message: "Commission not found" });
    }

    const { amount, percentage, type, status, remarks } = req.body;

    let updatedCommissionAmount = commission.commissionAmount;

    // Recalculate if amount or percentage changes
    if (amount !== undefined || percentage !== undefined) {
      const newAmount = amount ?? commission.amount;
      const newPercentage = percentage ?? commission.percentage;
      updatedCommissionAmount = (newAmount * newPercentage) / 100;
    }

    await commission.update({
      amount: amount ?? commission.amount,
      percentage: percentage ?? commission.percentage,
      commissionAmount: updatedCommissionAmount,
      type: type ?? commission.type,
      status: status ?? commission.status,
      remarks: remarks ?? commission.remarks,
    });

    res.json({
      message: "Commission updated successfully",
      data: commission,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE COMMISSION =================
const deleteCommission = async (req, res) => {
  try {
    const commission = await Commission.findByPk(req.params.id);

    if (!commission) {
      return res.status(404).json({ message: "Commission not found" });
    }

    await commission.destroy();

    res.json({ message: "Commission deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createCommission,
  getAllCommissions,
  getCommissionById,
  updateCommission,
  deleteCommission,
};