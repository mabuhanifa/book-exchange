"use client";

import React, { useState } from "react";
// Import Shadcn Input component later
import { Input } from "@/components/ui/input"; // Assuming Shadcn Input is installed here

interface SearchInputProps {
  onSearchSubmit: (query: string) => void;
}

export default function SearchInput({ onSearchSubmit }: SearchInputProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-[300px]" // Example styling
      />
    </form>
  );
}
