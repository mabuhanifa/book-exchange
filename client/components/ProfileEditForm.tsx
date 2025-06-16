"use client";

import React, { useEffect, useState } from "react";
// Import Shadcn Form, Input, Textarea, Select, Button later

interface ProfileFormData {
  name: string;
  area: string;
  bio?: string;
  // Add other editable fields
}

interface ProfileEditFormProps {
  initialData: ProfileFormData;
  onSubmit: (data: ProfileFormData) => void;
  loading: boolean;
  error: string | null;
}

export default function ProfileEditForm({
  initialData,
  onSubmit,
  loading,
  error,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState<ProfileFormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Shadcn Form */}
      <div>
        <label htmlFor="name">Name</label>
        {/* Shadcn Input */}
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="area">Area</label>
        {/* Shadcn Input */}
        <input
          id="area"
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="bio">Bio</label>
        {/* Shadcn Textarea */}
        <textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
        />
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {/* Shadcn Button */}
      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </button>
    </form>
  );
}
