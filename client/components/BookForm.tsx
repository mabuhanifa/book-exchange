"use client";

import React, { useEffect, useState } from "react";
// Import Shadcn Form, Input, Textarea, Select, Button later
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';

interface BookFormData {
  title: string;
  author: string;
  description: string;
  condition: string;
  type: "exchange" | "sell" | "borrow";
  price?: number;
  exchangeFor?: string;
  borrowDuration?: string;
  images?: FileList | null; // For new uploads
  existingImages?: string[]; // For displaying existing images in edit mode
  availability: string;
}

interface BookFormProps {
  initialData?: BookFormData; // For editing
  onSubmit: (data: BookFormData) => void;
  loading: boolean;
  error: string | null;
}

export default function BookForm({
  initialData,
  onSubmit,
  loading,
  error,
}: BookFormProps) {
  const [formData, setFormData] = useState<BookFormData>(
    initialData || {
      title: "",
      author: "",
      description: "",
      condition: "",
      type: "sell",
      price: undefined,
      exchangeFor: undefined,
      borrowDuration: undefined,
      images: null,
      existingImages: [],
      availability: "available",
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Shadcn Form */}
      <div>
        <label htmlFor="title">Title</label>
        {/* Shadcn Input */}
        <input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        {/* Shadcn Input */}
        <input
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        {/* Shadcn Textarea */}
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="condition">Condition</label>
        {/* Shadcn Select */}
        <select
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          required
        >
          <option value="">Select condition</option>
          <option value="new">New</option>
          <option value="like new">Like New</option>
          <option value="good">Good</option>
          <option value="fair">Fair</option>
          <option value="poor">Poor</option>
        </select>
      </div>
      <div>
        <label htmlFor="type">Listing Type</label>
        {/* Shadcn Select */}
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="sell">Sell</option>
          <option value="exchange">Exchange</option>
          <option value="borrow">Borrow</option>
        </select>
      </div>

      {formData.type === "sell" && (
        <div>
          <label htmlFor="price">Price</label>
          {/* Shadcn Input */}
          <input
            id="price"
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleChange}
            required
          />
        </div>
      )}
      {formData.type === "exchange" && (
        <div>
          <label htmlFor="exchangeFor">Exchange For</label>
          {/* Shadcn Input */}
          <input
            id="exchangeFor"
            name="exchangeFor"
            value={formData.exchangeFor || ""}
            onChange={handleChange}
            required
          />
        </div>
      )}
      {formData.type === "borrow" && (
        <div>
          <label htmlFor="borrowDuration">Borrow Duration</label>
          {/* Shadcn Input */}
          <input
            id="borrowDuration"
            name="borrowDuration"
            value={formData.borrowDuration || ""}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div>
        <label htmlFor="images">Images</label>
        {/* File Input */}
        <input
          id="images"
          name="images"
          type="file"
          multiple
          onChange={handleFileChange}
        />
        {/* Display existing images if in edit mode */}
        {formData.existingImages &&
          formData.existingImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Existing image ${index + 1}`}
              className="w-20 h-20 object-cover mr-2"
            />
          ))}
      </div>

      <div>
        <label htmlFor="availability">Availability</label>
        {/* Shadcn Select */}
        <select
          id="availability"
          name="availability"
          value={formData.availability}
          onChange={handleChange}
          required
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
        </select>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      {/* Shadcn Button */}
      <button type="submit" disabled={loading}>
        {loading
          ? "Saving..."
          : initialData
          ? "Update Listing"
          : "Create Listing"}
      </button>
    </form>
  );
}
