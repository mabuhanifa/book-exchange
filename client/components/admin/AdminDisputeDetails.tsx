"use client";

import Link from "next/link";
import React, { useState } from "react";
// Import Shadcn Form, Textarea, Select, Button later

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

export default function AdminDisputeDetails({
  dispute,
  loading,
  error,
  onResolve,
  resolving,
  resolutionError,
}: AdminDisputeDetailsProps) {
  const [resolution, setResolution] = useState("");
  const [outcome, setOutcome] = useState(""); // e.g., 'favor_initiator', 'favor_receiver', 'mutual', 'cancelled'

  if (loading) return <div>Loading dispute details...</div>;
  if (error) return <div>Error loading dispute details: {error}</div>;
  if (!dispute) return <div>Dispute not found.</div>;

  const isResolvable =
    dispute.status === "open" || dispute.status === "resolving";

  const handleSubmitResolution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolution.trim() || !outcome) {
      alert("Please provide resolution notes and select an outcome.");
      return;
    }
    onResolve({ resolution, outcome });
  };

  return (
    <div>
      <h1>Dispute Details: {dispute.id}</h1>
      <p>Status: {dispute.status}</p>
      <p>
        Raised By:
        <Link href={`/admin/users/${dispute.raisedBy.id}`}>
          {dispute.raisedBy.name}
        </Link>
      </p>
      <p>
        Regarding Transaction:
        <Link
          href={`/transactions/${dispute.transaction.type}/${dispute.transaction.id}`}
        >
          {dispute.transaction.bookTitle} ({dispute.transaction.type})
        </Link>
      </p>
      <p>
        Participants:
        <Link href={`/admin/users/${dispute.transaction.initiator.id}`}>
          {dispute.transaction.initiator.name}
        </Link>
        {" vs "}
        <Link href={`/admin/users/${dispute.transaction.receiver.id}`}>
          {dispute.transaction.receiver.name}
        </Link>
      </p>
      <p>Reason: {dispute.reason}</p>
      {dispute.details && <p>Details: {dispute.details}</p>}
      <p>Created At: {new Date(dispute.createdAt).toLocaleString()}</p>

      {dispute.status !== "open" && (
        <div>
          <h2>Resolution</h2>
          <p>Outcome: {dispute.status}</p> {/* Display resolved status */}
          <p>Notes: {dispute.resolution}</p>
          {dispute.resolvedBy && <p>Resolved By: {dispute.resolvedBy.name}</p>}
          {dispute.resolvedAt && (
            <p>Resolved At: {new Date(dispute.resolvedAt).toLocaleString()}</p>
          )}
        </div>
      )}

      {isResolvable && (
        <div>
          <h2>Resolve Dispute</h2>
          <form onSubmit={handleSubmitResolution}>
            {/* Shadcn Form */}
            <div>
              <label htmlFor="outcome">Outcome</label>
              {/* Shadcn Select */}
              <select
                id="outcome"
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
                required
              >
                <option value="">Select Outcome</option>
                <option value="favor_initiator">Favor Initiator</option>
                <option value="favor_receiver">Favor Receiver</option>
                <option value="mutual">Mutual Agreement</option>
                <option value="cancelled">Transaction Cancelled</option>
                {/* Add other outcomes */}
              </select>
            </div>
            <div>
              <label htmlFor="resolution">Resolution Notes</label>
              {/* Shadcn Textarea */}
              <textarea
                id="resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                required
              />
            </div>
            {resolutionError && (
              <div className="text-red-500">{resolutionError}</div>
            )}
            {/* Shadcn Button */}
            <button type="submit" disabled={resolving}>
              {resolving ? "Submitting..." : "Submit Resolution"}
            </button>
          </form>
        </div>
      )}

      {/* Links/sections to view related Transaction Details, Chat */}
    </div>
  );
}
