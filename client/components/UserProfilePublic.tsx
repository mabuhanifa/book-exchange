// Import components for displaying rating later

interface User {
  id: string;
  name: string;
  area: string;
  bio?: string;
  image?: string;
  rating: number;
  totalReviews: number;
}

interface UserProfilePublicProps {
  user: User;
  loading: boolean;
  error: string | null;
  // Add props for reviews data/pagination later if UserReviewList is included here
}

export default function UserProfilePublic({
  user,
  loading,
  error,
}: UserProfilePublicProps) {
  if (loading) return <div>Loading user profile...</div>;
  if (error) return <div>Error loading user profile: {error}</div>;
  if (!user) return <div>User not found.</div>;

  return (
    <div>
      {user.image && (
        <img
          src={user.image}
          alt={`${user.name}'s profile`}
          className="w-24 h-24 rounded-full object-cover"
        />
      )}
      <h1>{user.name}</h1>
      <p>Area: {user.area}</p>
      {user.bio && <p>Bio: {user.bio}</p>}
      {/* Display Rating component */}
      <p>
        Rating: {user.rating.toFixed(1)} ({user.totalReviews} reviews)
      </p>

      {/* UserReviewList component can be included here */}
      {/* <UserReviewList userId={user.id} type="received" /> */}
    </div>
  );
}
