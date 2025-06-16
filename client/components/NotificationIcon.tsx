"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import NotificationListModal from "./NotificationListModal"; // The list component
import Modal from "./ui/Modal"; // Assuming Modal is used for the list
// Import Shadcn Badge later

interface Notification {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// Dummy fetch function - replace with your actual API call
const fetchNotifications = async (): Promise<Notification[]> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Return dummy data
  return [
    {
      id: "1",
      message: "New message from John",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      message: "Your book request was accepted",
      read: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      message: "Admin updated your profile",
      read: true,
      createdAt: new Date().toISOString(),
    },
  ];
};

interface NotificationIconProps {
  // No longer need to pass notifications or count as props
  // Add props like currentUser if needed for conditional fetching
}

export default function NotificationIcon({}: NotificationIconProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use TanStack Query to fetch notifications
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    // Add options like refetchInterval for real-time updates
    // refetchInterval: 60000, // Refetch every 60 seconds
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  // Dummy mutation functions - replace with actual API calls
  const markAsRead = (id: string) => {
    console.log("Marking notification as read:", id);
    // Call API to mark as read
    // On success, invalidate the query to refetch or manually update cache
    // queryClient.invalidateQueries(['notifications']);
  };

  const markAllAsRead = () => {
    console.log("Marking all notifications as read");
    // Call API to mark all as read
    // On success, invalidate the query
    // queryClient.invalidateQueries(['notifications']);
  };

  const onDeleteNotification = (id: string) => {
    console.log("Deleting notification:", id);
    // Call API to delete
    // On success, invalidate the query
    // queryClient.invalidateQueries(['notifications']);
  };

  return (
    <div>
      {/* Icon */}
      {/* Shadcn Badge for unreadCount */}
      <button onClick={() => setIsModalOpen(true)} disabled={isLoading}>
        Notifications ({isLoading ? "..." : unreadCount})
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Notifications"
      >
        {error && <div>Error loading notifications: {error.message}</div>}
        {/* Pass fetched data and actions to the list component */}
        <NotificationListModal
          isOpen={true} // Modal controls visibility, list component is always rendered when modal is open
          onClose={() => setIsModalOpen(false)}
          notifications={notifications || []}
          onMarkAsRead={markAsRead}
          onMarkAllRead={markAllAsRead}
          onDeleteNotification={onDeleteNotification}
        />
      </Modal>
    </div>
  );
}
