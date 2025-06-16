import React from 'react';
import Link from 'next/link';
// Import Shadcn Button later

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  // Add other user fields
}

interface AdminUserRowProps {
  user: User;
  onSuspend?: (userId: string) => void;
  onRestore?: (userId: string) => void;
}

export default function AdminUserRow({ user, onSuspend, onRestore }: AdminUserRowProps) {
  return (
    <tr>
      <td>
        <Link href={`/admin/users/${user.id}`}>
          {user.name}
        </Link>
      </td>
      <td>{user.phoneNumber}</td>
      <td>{user.role}</td>
      <td>{user.status}</td>
      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        {user.status === 'active' && onSuspend && (
          {/* Shadcn Button */}
          <button onClick={() => onSuspend(user.id)}>Suspend</button>
        )}
        {user.status === 'suspended' && onRestore && (
          {/* Shadcn Button */}
          <button onClick={() => onRestore(user.id)}>Restore</button>
        )}
        {/* Add other actions like Edit Role */}
      </td>
    </tr>
  );
}
