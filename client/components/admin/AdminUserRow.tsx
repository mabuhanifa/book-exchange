import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  role: "user" | "admin";
  status: "active" | "suspended";
  createdAt: string;
  // Add other user fields
}

interface AdminUserRowProps {
  user: User;
  onSuspend?: (userId: string) => void;
  onRestore?: (userId: string) => void;
}

export default function AdminUserRow({
  user,
  onSuspend,
  onRestore,
}: AdminUserRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
      </TableCell>
      <TableCell>{user.phoneNumber}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>{user.status}</TableCell>
      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
      <TableCell>
        {user.status === "active" && onSuspend && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onSuspend(user.id)}
          >
            Suspend
          </Button>
        )}
        {user.status === "suspended" && onRestore && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onRestore(user.id)}
          >
            Restore
          </Button>
        )}
        {/* Add other actions like Edit Role */}
      </TableCell>
    </TableRow>
  );
}
