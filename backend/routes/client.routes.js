const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} = require("../controllers/client.controller");

const { protect } = require("../middleware/auth");


// ================= CREATE CLIENT =================
router.post(
  "/",
  protect,
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Client name is required"),

    body("email")
      .optional()
      .isEmail()
      .withMessage("Valid email is required"),

    body("phone")
      .notEmpty()
      .withMessage("Phone number is required"),
  ],
  createClient
);


// ================= GET ALL CLIENTS =================
router.get("/", protect, getAllClients);


// ================= GET SINGLE CLIENT =================
router.get("/:id", protect, getClientById);


// ================= UPDATE CLIENT =================
router.put(
  "/:id",
  protect,
  [
    body("email")
      .optional()
      .isEmail()
      .withMessage("Valid email is required"),

    body("name")
      .optional()
      .trim(),

    body("phone")
      .optional(),
  ],
  updateClient
);


// ================= DELETE CLIENT =================
router.delete("/:id", protect, deleteClient);


module.exports = router;