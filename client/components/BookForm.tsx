"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios"; // Use axios for client-side requests
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ErrorMessage from "./ui/ErrorMessage";

// Import react-hook-form and zod for validation later
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import * as z from 'zod';

// Define a basic schema (will be used with Zod later)
// const formSchema = z.object({
//   title: z.string().min(2, { message: "Title must be at least 2 characters." }),
//   author: z.string().min(2, { message: "Author must be at least 2 characters." }),
//   description: z.string().min(10, { message: "Description must be at least 10 characters." }),
//   condition: z.enum(["new", "like new", "good", "fair", "poor"]),
//   type: z.enum(["exchange", "sell", "borrow"]),
//   price: z.number().optional(), // Add validation based on type
//   exchangeFor: z.string().optional(), // Add validation based on type
//   borrowDuration: z.string().optional(), // Add validation based on type
//   availability: z.enum(["available", "unavailable"]),
//   // images: z.any().optional(), // File validation is more complex
// });

interface BookFormData {
  title: string;
  author: string;
  description: string;
  condition: string;
  type: "exchange" | "sell" | "borrow";
  price?: number;
  exchangeFor?: string;
  borrowDuration?: string;
  images?: FileList | null;
  existingImages?: string[];
  availability: string;
}

interface BookFormProps {
  initialData?: BookFormData;
}

export default function BookForm({ initialData }: BookFormProps) {
  const router = useRouter();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Setup react-hook-form (will integrate with Shadcn Form later)
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: initialData || { ... },
  // });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // form.reset(initialData); // Reset form with initial data for react-hook-form
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

  const handleSelectChange = (name: keyof BookFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, images: e.target.files }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Use form.handleSubmit(onSubmitLogic) with react-hook-form
    // For now, manual submission:

    setLoading(true);
    setError(null);

    // Prepare data for submission
    const dataToSubmit = new FormData();
    dataToSubmit.append("title", formData.title);
    dataToSubmit.append("author", formData.author);
    dataToSubmit.append("description", formData.description);
    dataToSubmit.append("condition", formData.condition);
    dataToSubmit.append("type", formData.type);
    if (formData.type === "sell" && formData.price !== undefined)
      dataToSubmit.append("price", formData.price.toString());
    if (formData.type === "exchange" && formData.exchangeFor)
      dataToSubmit.append("exchangeFor", formData.exchangeFor);
    if (formData.type === "borrow" && formData.borrowDuration)
      dataToSubmit.append("borrowDuration", formData.borrowDuration);
    dataToSubmit.append("availability", formData.availability);

    // Append new images
    if (formData.images) {
      for (let i = 0; i < formData.images.length; i++) {
        dataToSubmit.append("images", formData.images[i]);
      }
    }
    // For editing, you might need to send which existing images to keep/remove
    // dataToSubmit.append('existingImages', JSON.stringify(formData.existingImages));

    const url = initialData
      ? `/api/proxy/books/${initialData.id}`
      : "/api/proxy/books";
    const method = initialData ? "put" : "post";

    try {
      // Use axios to call the Next.js proxy API route
      const response = await axios({
        method,
        url,
        data: dataToSubmit,
        // Note: axios automatically sets Content-Type for FormData
        // You might need an interceptor here or in a wrapper to handle 401s for token refresh
      });

      console.log("Book saved successfully:", response.data);
      // Redirect on success
      router.push(`/books/${response.data.id}`); // Assuming the response includes the new/updated book ID
    } catch (err: any) {
      console.error("Failed to save book:", err);
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Wrap with Shadcn Form component later
    // <Form {...form}>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Shadcn FormField for each input */}
      <div>
        <label htmlFor="title">Title</label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        {/* <FormMessage /> */}
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <Input
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description</label>
        <Textarea
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
        <Select
          value={formData.condition}
          onValueChange={(value) => handleSelectChange("condition", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="like new">Like New</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="type">Listing Type</label>
        {/* Shadcn Select */}
        <Select
          value={formData.type}
          onValueChange={(value: "exchange" | "sell" | "borrow") =>
            handleSelectChange("type", value)
          }
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sell">Sell</SelectItem>
            <SelectItem value="exchange">Exchange</SelectItem>
            <SelectItem value="borrow">Borrow</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "sell" && (
        <div>
          <label htmlFor="price">Price</label>
          <Input
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
          <Input
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
          <Input
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
        <Input
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
        <Select
          value={formData.availability}
          onValueChange={(value) => handleSelectChange("availability", value)}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Select availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ErrorMessage error={error} />
      <Button type="submit" disabled={loading}>
        {loading
          ? "Saving..."
          : initialData
          ? "Update Listing"
          : "Create Listing"}
      </Button>
    </form>
    // </Form>
  );
}
