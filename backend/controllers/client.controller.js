const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const Client = require("../models/Client");
const Lead = require("../models/Lead");


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



// Helper to map lead loanType to client loanType enum
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

// ================= GET ALL CLIENTS =================
const getAllClients = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role !== "admin") {
      // Base filter: clients explicitly assigned to this user
      const orConditions = [{ assignedTo: req.user.id }];

      // Also ensure that for each of this user's converted leads we have a matching client.
      const convertedLeads = await Lead.findAll({
        where: {
          status: "Converted",
          [Op.or]: [
            { createdBy: req.user.id },
            { assignedTo: req.user.id },
          ],
        },
      });

      for (const lead of convertedLeads) {
        if (!lead.email) continue;

        const ownerId = lead.assignedTo || lead.createdBy || req.user.id;
        const loanTypeEnum = mapLoanTypeToClientEnum(lead.loanType);

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
      }

      // After ensuring/updating clients, build final filter for this user
      whereClause = {
        [Op.or]: [
          { assignedTo: req.user.id },
        ],
      };
    }

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