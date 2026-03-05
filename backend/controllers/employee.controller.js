const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Employee = require("../models/Employee");
const logActivity = require("../utils/activityLogger");


// ================= CREATE EMPLOYEE =================
const createEmployee = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, department, role, salary, status } = req.body;

    const existingEmployee = await Employee.findOne({ where: { email } });
    if (existingEmployee) {
      return res.status(400).json({ message: "Employee with this email already exists" });
    }

    const employee = await Employee.create({
      name,
      email,
      phone,
      department,
      role,
      salary,
      status: status || "active",
      createdBy: req.user.id,
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "CREATE",
      "Employee",
      `Employee created: ${employee.name}`
    );

    res.status(201).json({
      message: "Employee created successfully",
      data: employee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET ALL EMPLOYEES =================
const getAllEmployees = async (req, res) => {
  try {

    // Only admin should reach here (enforced by route), but just in case:
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Show only managers and staff in the employee list
    const employees = await Employee.findAll({
      where: {
        role: {
          [Op.in]: ["manager", "staff"],
        },
      },
      order: [["createdAt", "DESC"]],
    });

    res.json(employees);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE EMPLOYEE =================
const getEmployeeById = async (req, res) => {
  try {

    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE EMPLOYEE =================
const updateEmployee = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { name, email, phone, department, role, salary, status } = req.body;

    if (email && email !== employee.email) {
      const emailExists = await Employee.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    await employee.update({
      name: name ?? employee.name,
      email: email ?? employee.email,
      phone: phone ?? employee.phone,
      department: department ?? employee.department,
      role: role ?? employee.role,
      salary: salary ?? employee.salary,
      status: status ?? employee.status,
    });

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "UPDATE",
      "Employee",
      `Employee updated: ${employee.name}`
    );

    res.json({
      message: "Employee updated successfully",
      data: employee,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE EMPLOYEE =================
const deleteEmployee = async (req, res) => {
  try {

    const employee = await Employee.findByPk(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.destroy();

    // ===== ACTIVITY LOG =====
    await logActivity(
      req.user.id,
      "DELETE",
      "Employee",
      "Employee record deleted"
    );

    res.json({ message: "Employee deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};