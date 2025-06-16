interface AdminStats {
  totalUsers: number;
  totalBooks: number;
  activeTransactions: number;
  openDisputes: number;
  // Add other relevant stats
}

interface AdminDashboardProps {
  stats: AdminStats;
  loading: boolean;
  error: string | null;
}

export default function AdminDashboard({
  stats,
  loading,
  error,
}: AdminDashboardProps) {
  if (loading) return <div>Loading admin dashboard...</div>;
  if (error) return <div>Error loading dashboard: {error}</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border p-4 rounded-md">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div>
        <div className="border p-4 rounded-md">
          <h3>Total Books</h3>
          <p>{stats.totalBooks}</p>
        </div>
        <div className="border p-4 rounded-md">
          <h3>Active Transactions</h3>
          <p>{stats.activeTransactions}</p>
        </div>
        <div className="border p-4 rounded-md">
          <h3>Open Disputes</h3>
          <p>{stats.openDisputes}</p>
        </div>
        {/* Add other stats */}
      </div>
    </div>
  );
}
