import Link from "next/link";
// Import Shadcn NavigationMenu later

interface NavigationProps {
  // Add props like currentUser later for conditional links
}

export default function Navigation({}: NavigationProps) {
  return (
    <nav className="bg-muted p-2">
      <ul className="flex space-x-4 container mx-auto px-4">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/books">Books</Link>
        </li>
        {/* Add conditional links based on auth status */}
        <li>
          <Link href="/auth/login">Login</Link>
        </li>
        <li>
          <Link href="/auth/register">Register</Link>
        </li>
        {/* Add private links like Dashboard, Profile, etc. */}
      </ul>
    </nav>
  );
}
