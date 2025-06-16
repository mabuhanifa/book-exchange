import React from 'react';
// Import Shadcn Button later

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  area?: string;
  bio?: string;
  image?: string;
  rating: number;
  totalReviews: number;
  // Add other user fields
}

interface AdminUserDetailsProps {
  user: User;
  loading: boolean;
  error: string | null;
  onSuspend?: (userId: string) => void;
  onRestore?: (userId: string) => void;
}

export default function AdminUserDetails({ user, loading, error, onSuspend, onRestore }: AdminUserDetailsProps) {
  if (loading) return <div>Loading user details...</div>;
  if (error) return <div>Error loading user details: {error}</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div>
      <h1>User Details: {user.name}</h1>
      {user.image && <img src={user.image} alt={`${user.name}'s profile`} className="w-24 h-24 rounded-full object-cover" />}
      <p>ID: {user.id}</p>
      <p>Phone: {user.phoneNumber}</p>
      <p>Role: {user.role}</p>
      <p>Status: {user.status}</p>
      <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
      <p>Area: {user.area}</p>
      <p>Bio: {user.bio}</p>
      <p>Rating: {user.rating.toFixed(1)} ({user.totalReviews} reviews)</p>

      <div>
        {user.status === 'active' && onSuspend && (
          {/* Shadcn Button */}
          <button onClick={() => onSuspend(user.id)}>Suspend User</button>
        )}
        {user.status === 'suspended' && onRestore && (
          {/* Shadcn Button */}
          <button onClick={() => onRestore(user.id)}>Restore User</button>
        )}
        {/* Add other admin actions like changing role, viewing related data */}
      </div>

      {/* Sections to display related Books, Transactions, Reviews, Disputes */}
    </div>
  );
}
