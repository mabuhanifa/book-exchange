"use client";

import React, { useEffect, useState } from "react";
import ErrorMessage from "./ui/ErrorMessage";
// Import Shadcn Form components
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// Import react-hook-form and zod later

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    // Wrap with Shadcn Form component later
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="area">Area</label>
        {/* Assuming area might become a select later, keeping as input for now */}
        <Input
          id="area"
          name="area"
          value={formData.area}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="bio">Bio</label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
        />
      </div>

      <ErrorMessage error={error} />
      <Button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Update Profile"}
      </Button>
    </form>
  );
}
