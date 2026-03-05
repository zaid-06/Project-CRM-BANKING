const { validationResult } = require("express-validator");
const KYC = require("../models/KYC");


// ================= CREATE / GET KYC FOR CURRENT USER =================
const createKYC = async (req, res) => {
  try {
    const existingKyc = await KYC.findOne({
      where: { userId: req.user.id },
    });

    if (existingKyc) {
      return res.status(200).json({
        message: "KYC already exists for this user",
        data: existingKyc,
      });
    }

    const kyc = await KYC.create({
      userId: req.user.id,
    });

    res.status(201).json({
      message: "KYC initiated successfully",
      data: kyc,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET ALL KYC (Admin Only) =================
const getAllKYC = async (req, res) => {
  try {
    const kycs = await KYC.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(kycs);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE KYC =================
const getKYCById = async (req, res) => {
  try {
    const kyc = await KYC.findByPk(req.params.id);

    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }

    res.json(kyc);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE VERIFICATION STEPS =================
const updateKYC = async (req, res) => {
  try {
    const kyc = await KYC.findByPk(req.params.id);

    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }

    const {
      faceVerified,
      documentsVerified,
      locationVerified,
      otpVerified,
      faceImage,
      aadharImage,
      panImage,
      location,
    } = req.body;

    await kyc.update({
      faceVerified: faceVerified ?? kyc.faceVerified,
      documentsVerified: documentsVerified ?? kyc.documentsVerified,
      locationVerified: locationVerified ?? kyc.locationVerified,
      otpVerified: otpVerified ?? kyc.otpVerified,
      faceImage: faceImage ?? kyc.faceImage,
      aadharImage: aadharImage ?? kyc.aadharImage,
      panImage: panImage ?? kyc.panImage,
      location: location ?? kyc.location,
      status: "in-progress",
    });

    res.json({
      message: "KYC updated successfully",
      data: kyc,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= ADMIN APPROVE / REJECT =================
const updateKYCStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { status } = req.body;

    const kyc = await KYC.findByPk(req.params.id);

    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }

    await kyc.update({
      status,
      completedAt: status === "completed" ? new Date() : null,
    });

    res.json({
      message: "KYC status updated",
      data: kyc,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE KYC =================
const deleteKYC = async (req, res) => {
  try {
    const kyc = await KYC.findByPk(req.params.id);

    if (!kyc) {
      return res.status(404).json({ message: "KYC not found" });
    }

    await kyc.destroy();

    res.json({ message: "KYC deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createKYC,
  getAllKYC,
  getKYCById,
  updateKYC,
  updateKYCStatus,
  deleteKYC,
};