"use client";

// Import Shadcn Sheet/Dialog later

interface NotificationListModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: any[]; // Replace 'any' with actual notification type
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDeleteNotification: (id: string) => void;
}

export default function NotificationListModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllRead,
  onDeleteNotification,
}: NotificationListModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div>
      {/* Shadcn Sheet/Dialog Content */}
      <h2>Notifications</h2>
      <button onClick={onMarkAllRead}>Mark All as Read</button>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.message}
            <button onClick={() => onMarkAsRead(notification.id)}>
              Mark Read
            </button>
            <button onClick={() => onDeleteNotification(notification.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
