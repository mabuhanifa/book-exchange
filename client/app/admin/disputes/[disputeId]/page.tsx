import AdminDisputeDetails from "@/components/admin/AdminDisputeDetails";
import { callBackendApi } from "@/lib/api";
import { notFound } from "next/navigation";

interface Dispute {
  id: string;
  transaction: {
    id: string;
    type: string;
    bookTitle: string;
    initiator: { id: string; name: string };
    receiver: { id: string; name: string };
  };
  raisedBy: { id: string; name: string };
  status: "open" | "resolving" | "resolved" | "closed";
  reason: string;
  details?: string;
  resolution?: string;
  resolvedAt?: string;
  resolvedBy?: { id: string; name: string };
}

// Server Component data fetching
async function getDisputeDetails(disputeId: string): Promise<Dispute | null> {
  try {
    // Call the backend API via your proxy or directly from Server Component
    const dispute = await callBackendApi("GET", `/disputes/${disputeId}`); // Example: GET /api/proxy/disputes/disputeId
    return dispute;
  } catch (error: any) {
    console.error(`Failed to fetch dispute details for ${disputeId}:`, error);
    // Handle specific error statuses if needed (e.g., 404)
    if (error.response?.status === 404) {
      return null; // Dispute not found
    }
    throw error; // Re-throw other errors
  }
}

export default async function AdminDisputeDetailsPage({
  params,
}: {
  params: { disputeId: string };
}) {
  const dispute = await getDisputeDetails(params.disputeId);

  if (!dispute) {
    notFound(); // Render Next.js notFound page if dispute is null
  }

  // Dummy action handler (this would trigger a client-side mutation)
  const handleResolve = (resolutionData: {
    resolution: string;
    outcome: string;
  }) => {
    // This would typically be a client-side action using a mutation hook
    console.log("Client-side resolve dispute:", dispute.id, resolutionData);
    // Example: mutation.mutate({ id: dispute.id, ...resolutionData });
  };

  return (
    <div>
      {/* Pass fetched data to the Client Component */}
      <AdminDisputeDetails
        dispute={dispute}
        loading={false} // Loading is handled by Server Component fetch
        error={null} // Error handling needs refinement for Server Components
        onResolve={handleResolve} // Pass dummy handler
        resolving={false} // Resolving state managed client-side
        resolutionError={null} // Resolution error managed client-side
      />
    </div>
  );
}
