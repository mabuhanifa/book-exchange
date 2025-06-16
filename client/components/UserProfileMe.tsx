"use client";

import ProfileEditForm from "./ProfileEditForm";
import ProfileImageUpload from "./ProfileImageUpload";
// Import components for displaying rating later

interface User {
  id: string;
  name: string;
  area: string;
  bio?: string;
  image?: string;
  rating: number;
  totalReviews: number;
  // Add other editable fields
}

interface UserProfileMeProps {
  user: User;
  onSubmit: (data: any) => void; // Replace 'any' with actual form data type
  onImageUpload: (file: File) => void;
  loading: boolean;
  error: string | null;
}

export default function UserProfileMe({
  user,
  onSubmit,
  onImageUpload,
  loading,
  error,
}: UserProfileMeProps) {
  if (loading) return <div>Loading your profile...</div>;
  if (error) return <div>Error loading your profile: {error}</div>;
  if (!user) return <div>Profile not found.</div>;

  return (
    <div>
      <h1>My Profile</h1>
      <ProfileImageUpload
        currentImageUrl={user.image}
        onImageUpload={onImageUpload}
        loading={loading}
        error={error}
      />
      {/* Display Rating component */}
      <p>
        Rating: {user.rating.toFixed(1)} ({user.totalReviews} reviews)
      </p>

      <ProfileEditForm
        initialData={user}
        onSubmit={onSubmit}
        loading={loading}
        error={error}
      />

      {/* Links to My Books, My Reviews, etc. */}
    </div>
  );
}
