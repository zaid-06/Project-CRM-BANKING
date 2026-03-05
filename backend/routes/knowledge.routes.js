const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const {
  createKnowledge,
  getAllKnowledge,
  getKnowledgeById,
  updateKnowledge,
  deleteKnowledge,
} = require("../controllers/knowledge.controller");

const { protect } = require("../middleware/auth");


// ================= CREATE KNOWLEDGE =================
router.post(
  "/",
  protect,
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required"),

    body("content")
      .trim()
      .notEmpty()
      .withMessage("Content is required"),

    body("category")
      .optional()
      .trim(),

    body("status")
      .optional()
      .isIn(["active", "archived"])
      .withMessage("Status must be active or archived"),
  ],
  createKnowledge
);


// ================= GET ALL KNOWLEDGE =================
router.get("/", protect, getAllKnowledge);


// ================= GET SINGLE KNOWLEDGE =================
router.get("/:id", protect, getKnowledgeById);


// ================= UPDATE KNOWLEDGE =================
router.put(
  "/:id",
  protect,
  [
    body("title").optional().trim(),
    body("content").optional().trim(),
    body("category").optional().trim(),
    body("status")
      .optional()
      .isIn(["active", "archived"])
      .withMessage("Status must be active or archived"),
  ],
  updateKnowledge
);


// ================= DELETE KNOWLEDGE =================
router.delete("/:id", protect, deleteKnowledge);


module.exports = router;