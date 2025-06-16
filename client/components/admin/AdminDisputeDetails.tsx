"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import ErrorMessage from "../ui/ErrorMessage";
import LoadingSpinner from "../ui/LoadingSpinner";
// Import Shadcn Form components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
// Import react-hook-form and zod later
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface Dispute {
  id: string;
  transaction: {
    id: string;
    type: string;
    bookTitle: string;
    initiator: { id: string; name: string };
    receiver: { id: string; name: string };
  };
  raisedBy: { id: string; name: string };
  status: "open" | "resolving" | "resolved" | "closed";
  reason: string;
  details?: string; // More detailed description
  resolution?: string; // Admin's resolution notes
  resolvedAt?: string;
  resolvedBy?: { id: string; name: string };
  // Add other relevant dispute fields
}

interface AdminDisputeDetailsProps {
  dispute: Dispute;
  loading: boolean;
  error: string | null;
  onResolve: (resolutionData: { resolution: string; outcome: string }) => void; // Callback for resolution
  resolving: boolean; // State for resolution submission
  resolutionError: string | null; // Error for resolution submission
}

// Define Zod schema for resolution form
const resolutionFormSchema = z.object({
  outcome: z.string().min(1, { message: "Please select an outcome." }),
  resolution: z.string().min(10, {
    message: "Resolution notes must be at least 10 characters.",
  }),
});

type ResolutionFormValues = z.infer<typeof resolutionFormSchema>;

export default function AdminDisputeDetails({
  dispute,
  loading,
  error,
  onResolve,
  resolving,
  resolutionError,
}: AdminDisputeDetailsProps) {
  // Setup react-hook-form for the resolution form
  const form = useForm<ResolutionFormValues>({
    resolver: zodResolver(resolutionFormSchema),
    defaultValues: {
      outcome: "",
      resolution: "",
    },
  });

  const [resolution, setResolution] = useState("");
  const [outcome, setOutcome] = useState(""); // e.g., 'favor_initiator', 'favor_receiver', 'mutual', 'cancelled'

  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;
  if (!dispute) return <div>Dispute not found.</div>;

  const isResolvable =
    dispute.status === "open" || dispute.status === "resolving";

  const onSubmitResolution = async (values: ResolutionFormValues) => {
    onResolve(values);
  };

  return (
    <div className="space-y-4">
      <h1>Dispute Details: {dispute.id}</h1>
      <p>
        <strong>Status:</strong> {dispute.status}
      </p>
      <p>
        <strong>Raised By:</strong>
        <Link
          href={`/admin/users/${dispute.raisedBy.id}`}
          className="text-blue-600 ml-1"
        >
          {dispute.raisedBy.name}
        </Link>
      </p>
      <p>
        <strong>Regarding Transaction:</strong>
        <Link
          href={`/transactions/${dispute.transaction.type}/${dispute.transaction.id}`}
          className="text-blue-600 ml-1"
        >
          {dispute.transaction.bookTitle} ({dispute.transaction.type})
        </Link>
      </p>
      <p>
        <strong>Participants:</strong>
        <Link
          href={`/admin/users/${dispute.transaction.initiator.id}`}
          className="text-blue-600 ml-1"
        >
          {dispute.transaction.initiator.name}
        </Link>
        {" vs "}
        <Link
          href={`/admin/users/${dispute.transaction.receiver.id}`}
          className="text-blue-600 ml-1"
        >
          {dispute.transaction.receiver.name}
        </Link>
      </p>
      <p>
        <strong>Reason:</strong> {dispute.reason}
      </p>
      {dispute.details && (
        <p>
          <strong>Details:</strong> {dispute.details}
        </p>
      )}
      <p>
        <strong>Created At:</strong>{" "}
        {new Date(dispute.createdAt).toLocaleString()}
      </p>

      {dispute.status !== "open" && dispute.status !== "resolving" && (
        <div>
          <h2>Resolution</h2>
          <p>
            <strong>Outcome:</strong> {dispute.status}
          </p>
          <p>
            <strong>Notes:</strong> {dispute.resolution}
          </p>
          {dispute.resolvedBy && (
            <p>
              <strong>Resolved By:</strong> {dispute.resolvedBy.name}
            </p>
          )}
          {dispute.resolvedAt && (
            <p>
              <strong>Resolved At:</strong>{" "}
              {new Date(dispute.resolvedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {isResolvable && (
        <div className="space-y-4">
          <h2>Resolve Dispute</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitResolution)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="outcome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outcome</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Outcome" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="favor_initiator">
                          Favor Initiator
                        </SelectItem>
                        <SelectItem value="favor_receiver">
                          Favor Receiver
                        </SelectItem>
                        <SelectItem value="mutual">Mutual Agreement</SelectItem>
                        <SelectItem value="cancelled">
                          Transaction Cancelled
                        </SelectItem>
                        {/* Add other outcomes */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resolution Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter resolution details"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ErrorMessage error={resolutionError} />
              <Button type="submit" disabled={resolving}>
                {resolving ? "Submitting..." : "Submit Resolution"}
              </Button>
            </form>
          </Form>
        </div>
      )}

      {/* Links/sections to view related Transaction Details, Chat */}
    </div>
  );
}
