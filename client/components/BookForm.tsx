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
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import ErrorMessage from "./ui/ErrorMessage";

// Import react-hook-form and zod for validation
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Define the Zod schema for book data
const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  author: z
    .string()
    .min(2, { message: "Author must be at least 2 characters." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  condition: z.enum(["new", "like new", "good", "fair", "poor"], {
    errorMap: () => ({ message: "Please select a valid condition." }),
  }),
  type: z.enum(["exchange", "sell", "borrow"], {
    errorMap: () => ({ message: "Please select a valid listing type." }),
  }),
  price: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z
      .number()
      .positive({ message: "Price must be a positive number." })
      .optional()
  ),
  exchangeFor: z.string().optional(),
  borrowDuration: z.string().optional(),
  availability: z.enum(["available", "unavailable"], {
    errorMap: () => ({ message: "Please select availability status." }),
  }),
  // File validation is more complex and often handled outside Zod or with custom refinements
  // images: z.any().optional(),
});

// Refine schema based on type
const refinedFormSchema = formSchema.superRefine((data, ctx) => {
  if (
    data.type === "sell" &&
    (data.price === undefined || data.price === null)
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Price is required for 'Sell' listings.",
      path: ["price"],
    });
  }
  if (
    data.type === "exchange" &&
    (!data.exchangeFor || data.exchangeFor.trim() === "")
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "'Exchange For' is required for 'Exchange' listings.",
      path: ["exchangeFor"],
    });
  }
  if (
    data.type === "borrow" &&
    (!data.borrowDuration || data.borrowDuration.trim() === "")
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "'Borrow Duration' is required for 'Borrow' listings.",
      path: ["borrowDuration"],
    });
  }
});

type BookFormValues = z.infer<typeof refinedFormSchema>;

interface BookFormData extends BookFormValues {
  images?: FileList | null;
  existingImages?: string[];
}

interface BookFormProps {
  initialData?: BookFormData;
}

export default function BookForm({ initialData }: BookFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<FileList | null>(null); // Manage files separately
  const [existingImages, setExistingImages] = useState<string[]>(
    initialData?.existingImages || []
  ); // Manage existing images separately
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null); // For backend errors

  // Setup react-hook-form
  const form = useForm<BookFormValues>({
    resolver: zodResolver(refinedFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      author: initialData?.author || "",
      description: initialData?.description || "",
      condition: initialData?.condition || "",
      type: initialData?.type || "sell",
      price: initialData?.price,
      exchangeFor: initialData?.exchangeFor,
      borrowDuration: initialData?.borrowDuration,
      availability: initialData?.availability || "available",
    },
    mode: "onChange", // Validate on change
  });

  // Watch the 'type' field to conditionally require other fields
  const listingType = form.watch("type");

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        author: initialData.author,
        description: initialData.description,
        condition: initialData.condition,
        type: initialData.type,
        price: initialData.price,
        exchangeFor: initialData.exchangeFor,
        borrowDuration: initialData.borrowDuration,
        availability: initialData.availability,
      });
      setExistingImages(initialData.existingImages || []);
    }
  }, [initialData, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const onSubmit = async (values: BookFormValues) => {
    setLoading(true);
    setApiError(null);

    const dataToSubmit = new FormData();
    dataToSubmit.append("title", values.title);
    dataToSubmit.append("author", values.author);
    dataToSubmit.append("description", values.description);
    dataToSubmit.append("condition", values.condition);
    dataToSubmit.append("type", values.type);
    if (
      values.type === "sell" &&
      values.price !== undefined &&
      values.price !== null
    )
      dataToSubmit.append("price", values.price.toString());
    if (values.type === "exchange" && values.exchangeFor)
      dataToSubmit.append("exchangeFor", values.exchangeFor);
    if (values.type === "borrow" && values.borrowDuration)
      dataToSubmit.append("borrowDuration", values.borrowDuration);
    dataToSubmit.append("availability", values.availability);

    // Append new images
    if (images) {
      for (let i = 0; i < images.length; i++) {
        dataToSubmit.append("images", images[i]);
      }
    }
    // For editing, you might need to send which existing images to keep/remove
    // dataToSubmit.append('existingImages', JSON.stringify(existingImages));

    const url = initialData
      ? `/api/proxy/books/${initialData.id}`
      : "/api/proxy/books";
    const method = initialData ? "put" : "post";

    try {
      const response = await axios({
        method,
        url,
        data: dataToSubmit,
        // axios automatically sets Content-Type for FormData
      });

      console.log("Book saved successfully:", response.data);
      router.push(`/books/${response.data.id}`);
    } catch (err: any) {
      console.error("Failed to save book:", err);
      setApiError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Book Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Book Author" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Book Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="like new">Like New</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Listing Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sell">Sell</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                  <SelectItem value="borrow">Borrow</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {listingType === "sell" && (
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === ""
                          ? undefined
                          : Number(e.target.value)
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {listingType === "exchange" && (
          <FormField
            control={form.control}
            name="exchangeFor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exchange For</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Fantasy books, similar value"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {listingType === "borrow" && (
          <FormField
            control={form.control}
            name="borrowDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Borrow Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1 week, 1 month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div>
          {" "}
          {/* Manual file input for now */}
          <label
            htmlFor="images"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Images
          </label>
          <Input
            id="images"
            name="images"
            type="file"
            multiple
            onChange={handleFileChange}
          />
          {existingImages.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium">Existing Images:</p>
              <div className="flex space-x-2 overflow-x-auto">
                {existingImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Existing image ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <ErrorMessage error={apiError} />
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : initialData
            ? "Update Listing"
            : "Create Listing"}
        </Button>
      </form>
    </Form>
  );
}
