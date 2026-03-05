const { validationResult } = require("express-validator");
const Knowledge = require("../models/Knowledge");


// ================= CREATE KNOWLEDGE =================
const createKnowledge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, status } = req.body;

    const knowledge = await Knowledge.create({
      title,
      content,
      category,
      status: status || "active",
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Knowledge created successfully",
      data: knowledge,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET ALL KNOWLEDGE =================
const getAllKnowledge = async (req, res) => {
  try {
    const knowledgeList = await Knowledge.findAll({
      order: [["createdAt", "DESC"]],
    });

    res.json(knowledgeList);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= GET SINGLE KNOWLEDGE =================
const getKnowledgeById = async (req, res) => {
  try {
    const knowledge = await Knowledge.findByPk(req.params.id);

    if (!knowledge) {
      return res.status(404).json({ message: "Knowledge not found" });
    }

    res.json(knowledge);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= UPDATE KNOWLEDGE =================
const updateKnowledge = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const knowledge = await Knowledge.findByPk(req.params.id);

    if (!knowledge) {
      return res.status(404).json({ message: "Knowledge not found" });
    }

    const { title, content, category, status } = req.body;

    await knowledge.update({
      title: title ?? knowledge.title,
      content: content ?? knowledge.content,
      category: category ?? knowledge.category,
      status: status ?? knowledge.status,
    });

    res.json({
      message: "Knowledge updated successfully",
      data: knowledge,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



// ================= DELETE KNOWLEDGE =================
const deleteKnowledge = async (req, res) => {
  try {
    const knowledge = await Knowledge.findByPk(req.params.id);

    if (!knowledge) {
      return res.status(404).json({ message: "Knowledge not found" });
    }

    await knowledge.destroy();

    res.json({ message: "Knowledge deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createKnowledge,
  getAllKnowledge,
  getKnowledgeById,
  updateKnowledge,
  deleteKnowledge,
};