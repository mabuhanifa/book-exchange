const Notification = require("../models/Notification");
const asyncHandler = require("express-async-handler");

// Helper function to create a notification (can be called from other controllers)
const createNotification = async (
  recipientId,
  type,
  message,
  entityType,
  entityId,
  data = {}
) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      message,
      entityType,
      entityId,
      data,
    });
    // TODO: Implement real-time notification delivery (e.g., via WebSockets)
    // TODO: Implement push notification logic (e.g., using FCM)
    console.log(`Notification created for user ${recipientId}: ${message}`);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    // Decide how to handle notification creation errors (log, alert admin, etc.)
    throw error; // Re-throw to be caught by asyncHandler if needed
  }
};

// @desc    Get a list of notifications for the authenticated user
// @route   GET /api/notifications
// @access  Private
const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page = 1, limit = 10, isRead } = req.query; // Filter by read status

  const query = { recipient: userId };

  // Add isRead filter if provided
  if (isRead !== undefined) {
    query.isRead = isRead === "true"; // Query param is string, convert to boolean
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitInt = parseInt(limit);

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 }) // Sort by newest first
    .skip(skip)
    .limit(limitInt);

  const totalNotifications = await Notification.countDocuments(query);

  res.status(200).json({
    success: true,
    count: notifications.length,
    total: totalNotifications,
    page: parseInt(page),
    pages: Math.ceil(totalNotifications / limitInt),
    data: notifications,
  });
});

// @desc    Get the count of unread notifications for the authenticated user
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const unreadCount = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });

  res.status(200).json({ success: true, count: unreadCount });
});

// @desc    Mark a specific notification as read
// @route   PUT /api/notifications/:notificationId/mark-read
// @access  Private
const markNotificationAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  const notification = await Notification.findOne({
    _id: notificationId,
    recipient: userId,
  });

  if (!notification) {
    res.status(404);
    throw new Error("Notification not found");
  }

  if (!notification.isRead) {
    notification.isRead = true;
    await notification.save();
  }

  res
    .status(200)
    .json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
});

// @desc    Mark all notifications as read for the authenticated user
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const updateResult = await Notification.updateMany(
    { recipient: userId, isRead: false },
    { $set: { isRead: true } }
  );

  res
    .status(200)
    .json({
      success: true,
      message: `${updateResult.modifiedCount} notifications marked as read`,
    });
});

// @desc    Delete a specific notification
// @route   DELETE /api/notifications/:notificationId
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const userId = req.user._id;

  const deleteResult = await Notification.deleteOne({
    _id: notificationId,
    recipient: userId,
  });

  if (deleteResult.deletedCount === 0) {
    res.status(404);
    throw new Error("Notification not found");
  }

  res
    .status(200)
    .json({ success: true, message: "Notification deleted successfully" });
});

module.exports = {
  createNotification, // Export helper for use in other controllers
  getMyNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
