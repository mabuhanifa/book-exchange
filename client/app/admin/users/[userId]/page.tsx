import AdminUserDetails from "@/components/admin/AdminUserDetails";
import { callBackendApi } from "@/lib/api";
import { notFound } from "next/navigation";

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

// Server Component data fetching
async function getUserDetails(userId: string): Promise<User | null> {
  try {
    // Call the backend API via your proxy or directly from Server Component
    const user = await callBackendApi("GET", `/users/${userId}`); // Example: GET /api/proxy/users/userId
    return user;
  } catch (error: any) {
    console.error(`Failed to fetch user details for ${userId}:`, error);
    // Handle specific error statuses if needed (e.g., 404)
    if (error.response?.status === 404) {
      return null; // User not found
    }
    throw error; // Re-throw other errors
  }
}

export default async function AdminUserDetailsPage({
  params,
}: {
  params: { userId: string };
}) {
  const user = await getUserDetails(params.userId);

  if (!user) {
    notFound(); // Render Next.js notFound page if user is null
  }

  // Dummy action handlers (these would likely trigger client-side mutations)
  const handleSuspend = (userId: string) => {
    // This would typically be a client-side action using a mutation hook
    console.log("Client-side suspend user:", userId);
    // Example: mutation.mutate(userId);
  };
  const handleRestore = (userId: string) => {
    // This would typically be a client-side action using a mutation hook
    console.log("Client-side restore user:", userId);
    // Example: mutation.mutate(userId);
  };

  return (
    <div>
      {/* Pass fetched data to the Client Component */}
      <AdminUserDetails
        user={user}
        loading={false} // Loading is handled by Server Component fetch
        error={null} // Error handling needs refinement for Server Components
        onSuspend={handleSuspend} // Pass dummy handler
        onRestore={handleRestore} // Pass dummy handler
      />
    </div>
  );
}
