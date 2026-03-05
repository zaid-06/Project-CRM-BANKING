const { validationResult } = require("express-validator");
const Client = require("../models/Client");


// ================= CREATE CLIENT =================
const createClient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address, status } = req.body;

    const client = await Client.create({
      name,
      email,
      phone,
      address,
      status: status || "active",
      assignedTo: req.user.id, // tie client to current user
    });

    res.status(201).json({
      message: "Client created successfully",
      data: client,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET ALL CLIENTS =================
const getAllClients = async (req, res) => {
  try {
    const whereClause =
      req.user.role === "admin"
        ? {}
        : { assignedTo: req.user.id };

    const clients = await Client.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    res.json(clients);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE CLIENT =================
const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.json(client);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE CLIENT =================
const updateClient = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const { name, email, phone, address, status } = req.body;

    // Only admin can update any client; others only their own
    if (req.user.role !== "admin" && client.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this client" });
    }

    await client.update({
      name: name ?? client.name,
      email: email ?? client.email,
      phone: phone ?? client.phone,
      address: address ?? client.address,
      status: status ?? client.status,
    });

    res.json({
      message: "Client updated successfully",
      data: client,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE CLIENT =================
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // Only admin can delete any client; others only their own
    if (req.user.role !== "admin" && client.assignedTo !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this client" });
    }

    await client.destroy();

    res.json({ message: "Client deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};