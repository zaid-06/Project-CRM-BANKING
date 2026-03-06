const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Lead = require("../models/Lead");
const Client = require("../models/Client");
const logActivity = require("../utils/activityLogger");

const mapLoanTypeToClientEnum = (loanType) => {
  switch (loanType) {
    case "Home Loan":
      return "home_loan";
    case "Personal Loan":
      return "personal_loan";
    case "Business Loan":
      return "business_loan";
    case "Car Loan":
      return "car_loan";
    case "Gold Loan":
      return "gold_loan";
    default:
      return "personal_loan";
  }
};

const ensureClientFromLead = async (lead, userId) => {
  if (lead.status !== "Converted") return;

  const loanTypeEnum = mapLoanTypeToClientEnum(lead.loanType);

  // Prefer the staff who owns the lead as client owner
  const ownerId = lead.assignedTo || lead.createdBy || userId;

  const [client, created] = await Client.findOrCreate({
    where: { email: lead.email },
    defaults: {
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      loanType: loanTypeEnum,
      amount: lead.amount,
      status: "active",
      assignedTo: ownerId,
    },
  });

  if (!created) {
    await client.update({
      name: lead.name,
      phone: lead.phone,
      loanType: loanTypeEnum,
      amount: lead.amount,
      status: "active",
      assignedTo: ownerId,
    });
  }
};


// ================= GET ALL LEADS =================
const getLeads = async (req, res) => {
  try {
    const { search, status, limit } = req.query;

    const andConditions = [];

    if (status) {
      andConditions.push({ status });
    }

    if (search) {
      andConditions.push({
        [Op.or]: [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
          { phone: { [Op.like]: `%${search}%` } },
        ],
      });
    }

    // Non-admin users should only see their own / assigned leads
    if (req.user.role !== "admin") {
      andConditions.push({
        [Op.or]: [
          { createdBy: req.user.id },
          { assignedTo: req.user.id },
        ],
      });
    }

    const whereClause =
      andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    const findOptions = {
      where: whereClause,
      order: [["createdAt", "DESC"]],
    };

    if (limit) {
      const parsedLimit = parseInt(limit, 10);
      if (!Number.isNaN(parsedLimit) && parsedLimit > 0) {
        findOptions.limit = parsedLimit;
      }
    }

    const leads = await Lead.findAll(findOptions);

    res.json(leads);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE LEAD =================
const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= CREATE LEAD =================
const createLead = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, phone, email, source, status, notes, loanType, amount } = req.body;

    const lead = await Lead.create({
      name,
      phone,
      email,
      source,
      loanType,
      amount,
      status: status || "New",
      notes,
      createdBy: req.user.id,
    });

    await ensureClientFromLead(lead, req.user.id);

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "CREATE",
      "Lead",
      `New lead created: ${lead.name}`
    );

    res.status(201).json({
      message: "Lead created successfully",
      data: lead,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE LEAD =================
const updateLead = async (req, res) => {
  try {

    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const { name, phone, email, source, status, notes, assignedTo, loanType, amount } = req.body;

    await lead.update({
      name: name ?? lead.name,
      phone: phone ?? lead.phone,
      email: email ?? lead.email,
      source: source ?? lead.source,
      status: status ?? lead.status,
      notes: notes ?? lead.notes,
      assignedTo: assignedTo ?? lead.assignedTo,
      loanType: loanType ?? lead.loanType,
      amount: amount ?? lead.amount,
    });

    await ensureClientFromLead(lead, req.user.id);

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "UPDATE",
      "Lead",
      `Lead updated: ${lead.name}`
    );

    res.json({
      message: "Lead updated successfully",
      data: lead,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE LEAD =================
const deleteLead = async (req, res) => {
  try {

    const lead = await Lead.findByPk(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Only admin can delete any lead; others only their own / assigned
    if (
      req.user.role !== "admin" &&
      lead.createdBy !== req.user.id &&
      lead.assignedTo !== req.user.id
    ) {
      return res.status(403).json({ message: "Not authorized to delete this lead" });
    }

    await lead.destroy();

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "DELETE",
      "Lead",
      `Lead deleted: ${lead.name}`
    );

    res.json({ message: "Lead deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= LEAD STATS =================
const getLeadStats = async (req, res) => {
  try {

    const baseFilter =
      req.user.role === "admin"
        ? {}
        : {
            [Op.or]: [
              { createdBy: req.user.id },
              { assignedTo: req.user.id },
            ],
          };

    const total = await Lead.count({ where: baseFilter });

    const newLeads = await Lead.count({
      where: { ...baseFilter, status: "New" },
    });
    const contacted = await Lead.count({
      where: { ...baseFilter, status: "Contacted" },
    });
    const followup = await Lead.count({
      where: { ...baseFilter, status: "Follow-up" },
    });
    const converted = await Lead.count({
      where: { ...baseFilter, status: "Converted" },
    });
    const rejected = await Lead.count({
      where: { ...baseFilter, status: "Rejected" },
    });

    res.json({
      total,
      new: newLeads,
      contacted,
      followup,
      converted,
      rejected,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getLeadStats,
};