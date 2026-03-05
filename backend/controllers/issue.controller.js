const Issue = require("../models/Issue");
const logActivity = require("../utils/activityLogger");


// ================= GET ALL ISSUES =================
const getIssues = async (req, res) => {
  try {

    const issues = await Issue.findAll({
      order: [["createdAt", "DESC"]]
    });

    res.json(issues);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= GET ISSUE BY ID =================
const getIssueById = async (req, res) => {
  try {

    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= CREATE ISSUE =================
const createIssue = async (req, res) => {
  try {

    const { title, description, priority, assignedTo } = req.body;

    const issue = await Issue.create({
      title,
      description,
      priority,
      assignedTo,
      createdBy: req.user.id
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "CREATE",
      "Issue",
      `Issue created: ${issue.title}`
    );

    res.status(201).json(issue);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= UPDATE ISSUE =================
const updateIssue = async (req, res) => {
  try {

    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const { title, description, priority, status, assignedTo, resolution } = req.body;

    await issue.update({
      title: title || issue.title,
      description: description || issue.description,
      priority: priority || issue.priority,
      status: status || issue.status,
      assignedTo: assignedTo || issue.assignedTo,
      resolution: resolution || issue.resolution,
      resolvedAt: status === "resolved" ? new Date() : issue.resolvedAt
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "UPDATE",
      "Issue",
      `Issue updated: ${issue.title}`
    );

    res.json(issue);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


// ================= DELETE ISSUE =================
const deleteIssue = async (req, res) => {
  try {

    const issue = await Issue.findByPk(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await issue.destroy();

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "DELETE",
      "Issue",
      `Issue deleted: ${issue.title}`
    );

    res.json({ message: "Issue deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getIssues,
  getIssueById,
  createIssue,
  updateIssue,
  deleteIssue
};