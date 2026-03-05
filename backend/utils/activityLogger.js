const ActivityLog = require("../models/ActivityLog");

const logActivity = async (userId, action, module, description) => {

  try {

    await ActivityLog.create({
      userId,
      action,
      module,
      description
    });

  } catch (error) {

    console.error("Activity log error:", error);

  }

};

module.exports = logActivity;