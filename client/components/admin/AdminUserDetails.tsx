import { Button } from "@/components/ui/button";
import ErrorMessage from "../ui/ErrorMessage";
import LoadingSpinner from "../ui/LoadingSpinner";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: "user" | "admin";
  status: "active" | "suspended";
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

export default function AdminUserDetails({
  user,
  loading,
  error,
  onSuspend,
  onRestore,
}: AdminUserDetailsProps) {
  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <div>User not found.</div>;

  return (
    <div className="space-y-4">
      <h1>User Details: {user.name}</h1>
      {user.image && (
        <img
          src={user.image}
          alt={`${user.name}'s profile`}
          className="w-24 h-24 rounded-full object-cover"
        />
      )}
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Phone:</strong> {user.phoneNumber}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <p>
        <strong>Status:</strong> {user.status}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Area:</strong> {user.area}
      </p>
      <p>
        <strong>Bio:</strong> {user.bio}
      </p>
      <p>
        <strong>Rating:</strong> {user.rating.toFixed(1)} ({user.totalReviews}{" "}
        reviews)
      </p>

      <div className="flex space-x-4">
        {user.status === "active" && onSuspend && (
          <Button variant="destructive" onClick={() => onSuspend(user.id)}>
            Suspend User
          </Button>
        )}
        {user.status === "suspended" && onRestore && (
          <Button variant="secondary" onClick={() => onRestore(user.id)}>
            Restore User
          </Button>
        )}
        {/* Add other admin actions like changing role, viewing related data */}
      </div>

      {/* Sections to display related Books, Transactions, Reviews, Disputes */}
    </div>
  );
}
