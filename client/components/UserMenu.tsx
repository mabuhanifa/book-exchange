"use client";

// Import Shadcn DropdownMenu later

interface UserMenuProps {
  currentUser: any; // Replace 'any' with actual user type
}

export default function UserMenu({ currentUser }: UserMenuProps) {
  if (!currentUser) {
    return null; // Or a login/register button
  }

  return (
    <div>
      {/* Shadcn DropdownMenu Trigger */}
      <span>{currentUser.name || "User"}</span>
      {/* Shadcn DropdownMenu Content */}
      <div>
        {/* Profile link */}
        {/* Logout button */}
        {/* Admin link (conditional) */}
      </div>
    </div>
  );
}
