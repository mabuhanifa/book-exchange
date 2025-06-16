export default function AdminDisputeDetailsPage({
  params,
}: {
  params: { disputeId: string };
}) {
  return (
    <div>
      <h1>Admin Dispute Details for ID: {params.disputeId}</h1>
      {/* Admin dispute details and resolution will go here */}
    </div>
  );
}
