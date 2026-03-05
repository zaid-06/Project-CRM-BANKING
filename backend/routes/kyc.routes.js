const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createKYC,
  getAllKYC,
  getKYCById,
  updateKYC,
  updateKYCStatus,
  deleteKYC,
} = require("../controllers/kyc.controller");

const { protect } = require("../middleware/auth");


// ================= INITIATE KYC =================
router.post(
  "/",
  protect,
  createKYC
);


// ================= GET ALL KYC (Admin use) =================
router.get(
  "/",
  protect,
  getAllKYC
);


// ================= GET SINGLE KYC =================
router.get(
  "/:id",
  protect,
  getKYCById
);


// ================= UPDATE VERIFICATION STEPS =================
router.put(
  "/:id",
  protect,
  [
    body("faceVerified").optional().isBoolean(),
    body("documentsVerified").optional().isBoolean(),
    body("locationVerified").optional().isBoolean(),
    body("otpVerified").optional().isBoolean(),
  ],
  updateKYC
);


// ================= ADMIN UPDATE STATUS =================
router.put(
  "/:id/status",
  protect,
  [
    body("status")
      .isIn(["pending", "in-progress", "completed", "rejected"])
      .withMessage("Invalid status value"),
  ],
  updateKYCStatus
);


// ================= DELETE KYC =================
router.delete(
  "/:id",
  protect,
  deleteKYC
);


module.exports = router;