import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import Navigation from "./Navigation";

interface AppLayoutProps {
  children: React.ReactNode;
  // Add props like currentUser, unreadNotificationCount later
}

export default function AppLayout({ children }: AppLayoutProps) {
  // Placeholder for layout structure
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer />
    </div>
  );
}
