import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface Dispute {
  id: string;
  transaction: { id: string; type: string; bookTitle: string };
  raisedBy: { id: string; name: string };
  status: "open" | "resolving" | "resolved" | "closed";
  reason: string;
  createdAt: string;
  // Add other relevant dispute fields
}

interface DisputeCardProps {
  dispute: Dispute;
}

export default function DisputeCard({ dispute }: DisputeCardProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Dispute ID: {dispute.id.substring(0, 8)}...
        </CardTitle>
        <p className="text-sm text-gray-600">Status: {dispute.status}</p>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>
          Raised By:
          <Link
            href={`/admin/users/${dispute.raisedBy.id}`}
            className="text-blue-600 ml-1"
          >
            {dispute.raisedBy.name}
          </Link>
        </p>
        <p>
          Regarding Transaction:
          <Link
            href={`/transactions/${dispute.transaction.type}/${dispute.transaction.id}`}
            className="text-blue-600 ml-1"
          >
            {dispute.transaction.bookTitle} ({dispute.transaction.type})
          </Link>
        </p>
        <p>Reason: {dispute.reason}</p>
        <p>Created At: {new Date(dispute.createdAt).toLocaleString()}</p>
        <Link href={`/admin/disputes/${dispute.id}`}>
          <Button variant="outline" size="sm" className="mt-2">
            View Details / Resolve
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
