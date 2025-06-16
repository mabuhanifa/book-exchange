"use client";

// Import Shadcn Badge, Sheet/Dialog later

interface NotificationIconProps {
  unreadCount: number;
  notifications: any[]; // Replace 'any' with actual notification type
  onMarkAsRead: (id: string) => void;
  onMarkAllRead: () => void;
}

export default function NotificationIcon({
  unreadCount,
  notifications,
  onMarkAsRead,
  onMarkAllRead,
}: NotificationIconProps) {
  return (
    <div>
      {/* Icon */}
      {/* Shadcn Badge for unreadCount */}
      {/* Trigger for NotificationListModal (Sheet/Dialog) */}
      <span>Notifications ({unreadCount})</span>
      {/* NotificationListModal will be rendered here or elsewhere and controlled by state */}
    </div>
  );
}
