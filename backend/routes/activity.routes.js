const express = require("express");
const router = express.Router();

const ActivityLog = require("../models/ActivityLog");
const { protect } = require("../middleware/auth");

router.get("/", protect, async (req, res) => {

  const logs = await ActivityLog.findAll({
    order: [["createdAt", "DESC"]],
    limit: 20
  });

  res.json(logs);

});

module.exports = router;