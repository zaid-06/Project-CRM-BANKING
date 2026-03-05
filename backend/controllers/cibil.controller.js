const { validationResult } = require("express-validator");
const CIBIL = require("../models/CIBIL");
const logActivity = require("../utils/activityLogger");


// ================= CREATE CIBIL =================
const createCibil = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientId, score, status, remarks } = req.body;

    const newCibil = await CIBIL.create({
      clientId,
      score,
      status: status || "average",
      remarks,
      createdBy: req.user.id,
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "CREATE",
      "CIBIL",
      `CIBIL record created for clientId ${clientId} with score ${score}`
    );

    res.status(201).json({
      message: "CIBIL record created successfully",
      data: newCibil,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET ALL CIBIL =================
const getAllCibil = async (req, res) => {
  try {

    const records = await CIBIL.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(records);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE CIBIL =================
const getCibilById = async (req, res) => {
  try {

    const record = await CIBIL.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "CIBIL record not found" });
    }

    res.json(record);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE CIBIL =================
const updateCibil = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const record = await CIBIL.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "CIBIL record not found" });
    }

    const { score, status, remarks } = req.body;

    await record.update({
      score: score ?? record.score,
      status: status ?? record.status,
      remarks: remarks ?? record.remarks,
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "UPDATE",
      "CIBIL",
      `CIBIL updated for clientId ${record.clientId} new score ${record.score}`
    );

    res.json({
      message: "CIBIL record updated successfully",
      data: record,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE CIBIL =================
const deleteCibil = async (req, res) => {
  try {

    const record = await CIBIL.findByPk(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "CIBIL record not found" });
    }

    await record.destroy();

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "DELETE",
      "CIBIL",
      `CIBIL record deleted for clientId ${record.clientId}`
    );

    res.json({ message: "CIBIL record deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createCibil,
  getAllCibil,
  getCibilById,
  updateCibil,
  deleteCibil,
};