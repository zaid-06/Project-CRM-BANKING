const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const User = require("../models/User");

const normalizeIndianPhone10 = (raw) => {
  if (!raw) return null;

  let value = String(raw).trim();

  // Remove spaces, hyphens, parentheses, etc. Keep digits and leading +
  value = value.replace(/[^\d+]/g, "");

  // Strip +91 if provided
  if (value.startsWith("+91")) value = value.slice(3);

  // Strip leading 0 if provided (e.g. 0987...)
  if (value.startsWith("0")) value = value.slice(1);

  // Keep digits only
  value = value.replace(/\D/g, "");

  // If more than 10 digits (e.g. country code), keep last 10
  if (value.length > 10) value = value.slice(-10);

  return value || null;
};


// ================= GET ALL USERS =================
const getAllUsers = async (req, res) => {
  try {
    const whereClause = {};

    // Optional filter: only active staff and manager for employee listing
    if (req.query.onlyEmployees === "true") {
      whereClause.role = {
        [Op.in]: ["manager", "staff"],
      };
      whereClause.status = "active";
    }

    const users = await User.findAll({
      where: whereClause,
      attributes: { exclude: ["password", "refreshToken"] },
      order: [["createdAt", "DESC"]],
    });

    res.json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE USER =================
const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= CREATE USER =================
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phone, role, department } = req.body;

    const normalizedPhone = normalizeIndianPhone10(phone);

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (normalizedPhone) {
      const phoneExists = await User.findOne({ where: { phone: normalizedPhone } });
      if (phoneExists) {
        return res.status(400).json({ message: "Mobile number is already used" });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      phone: normalizedPhone,
      role,
      department,
      status: "active",
    });

    res.status(201).json({
      message: "User created successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE USER =================
const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, phone, role, department, status } = req.body;

    const normalizedPhone = phone !== undefined ? normalizeIndianPhone10(phone) : undefined;

    // Check duplicate email
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Check duplicate mobile number
    if (normalizedPhone && normalizedPhone !== user.phone) {
      const phoneExists = await User.findOne({ where: { phone: normalizedPhone } });
      if (phoneExists) {
        return res.status(400).json({ message: "Mobile number is already used" });
      }
    }

    await user.update({
      name: name ?? user.name,
      email: email ?? user.email,
      phone: normalizedPhone !== undefined ? normalizedPhone : user.phone,
      role: role ?? user.role,
      department: department ?? user.department,
      status: status ?? user.status,
    });

    res.json({
      message: "User updated successfully",
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE USER STATUS =================
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({ status });

    res.json({
      message: `User status updated to ${status}`,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE USER =================
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
};