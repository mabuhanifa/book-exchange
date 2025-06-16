export default function AdminUserDetailsPage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <div>
      <h1>Admin View User Details for ID: {params.userId}</h1>
      {/* Admin view of user details will go here */}
    </div>
  );
}
