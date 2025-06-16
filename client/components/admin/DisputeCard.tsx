import React from 'react';
import Link from 'next/link';
// Import Shadcn Card or other styling components later

interface Dispute {
  id: string;
  transaction: { id: string; type: string; bookTitle: string };
  raisedBy: { id: string; name: string };
  status: 'open' | 'resolving' | 'resolved' | 'closed';
  reason: string;
  createdAt: string;
  // Add other relevant dispute fields
}

interface DisputeCardProps {
  dispute: Dispute;
}

export default function DisputeCard({ dispute }: DisputeCardProps) {
  return (
    {/* Shadcn Card or styled div */}
    <div className="border p-4 rounded-md mb-4">
      <h3>Dispute ID: {dispute.id}</h3>
      <p>Status: {dispute.status}</p>
      <p>Raised By:
         <Link href={`/admin/users/${dispute.raisedBy.id}`}>
           {dispute.raisedBy.name}
         </Link>
      </p>
      <p>Regarding Transaction:
         <Link href={`/transactions/${dispute.transaction.type}/${dispute.transaction.id}`}>
           {dispute.transaction.bookTitle} ({dispute.transaction.type})
         </Link>
      </p>
      <p>Reason: {dispute.reason}</p>
      <p>Created At: {new Date(dispute.createdAt).toLocaleString()}</p>
      <Link href={`/admin/disputes/${dispute.id}`}>
        {/* Shadcn Button */}
        <button>View Details / Resolve</button>
      </Link>
    </div>
  );
}
