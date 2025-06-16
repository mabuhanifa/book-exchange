export default function UserProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  return (
    <div>
      <h1>User Profile for ID: {params.userId}</h1>
      {/* User profile details will go here */}
    </div>
  );
}
