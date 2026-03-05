const Notification = require("../models/Notification");

// Get all notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]]
    });

    res.json(notifications);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Mark as read
exports.markAsRead = async (req, res) => {
  try {

    const notification = await Notification.findByPk(req.params.id);

    if (!notification)
      return res.status(404).json({ message: "Notification not found" });

    notification.isRead = true;
    await notification.save();

    res.json({ message: "Notification marked as read" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};