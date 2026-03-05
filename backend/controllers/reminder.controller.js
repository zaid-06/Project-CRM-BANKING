const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Reminder = require("../models/Reminder");


// ================= CREATE REMINDER =================
const createReminder = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      reminderDate,
      type,
      status,
      leadId,
      clientId,
    } = req.body;

    const reminder = await Reminder.create({
      title,
      description,
      reminderDate,
      type: type || "call",
      status: status || "pending",
      leadId,
      clientId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Reminder created successfully",
      data: reminder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET ALL REMINDERS =================
const getAllReminders = async (req, res) => {
  try {
    const { status, today } = req.query;

    let whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    // Filter today's reminders
    if (today === "true") {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      whereClause.reminderDate = {
        [Op.between]: [startOfDay, endOfDay],
      };
    }

    const reminders = await Reminder.findAll({
      where: whereClause,
      order: [["reminderDate", "ASC"]],
    });

    res.json(reminders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE REMINDER =================
const getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    res.json(reminder);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE REMINDER =================
const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    const {
      title,
      description,
      reminderDate,
      type,
      status,
    } = req.body;

    await reminder.update({
      title: title ?? reminder.title,
      description: description ?? reminder.description,
      reminderDate: reminderDate ?? reminder.reminderDate,
      type: type ?? reminder.type,
      status: status ?? reminder.status,
    });

    res.json({
      message: "Reminder updated successfully",
      data: reminder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= MARK AS COMPLETED =================
const markAsCompleted = async (req, res) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await reminder.update({ status: "completed" });

    res.json({
      message: "Reminder marked as completed",
      data: reminder,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE REMINDER =================
const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findByPk(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: "Reminder not found" });
    }

    await reminder.destroy();

    res.json({ message: "Reminder deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createReminder,
  getAllReminders,
  getReminderById,
  updateReminder,
  deleteReminder,
  markAsCompleted,
};