"use client";

import TransactionDetails from "@/components/TransactionDetails";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface Transaction {
  id: string;
  type: "exchange" | "sell" | "borrow";
  status: string; // e.g., 'pending', 'accepted', 'completed', 'cancelled'
  book: { id: string; title: string; description: string; image?: string };
  initiator: { id: string; name: string };
  receiver: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
  // Add other relevant transaction details like price, exchange details, borrow dates, etc.
}

// Dummy fetch function - replace with your actual API call via proxy
const fetchTransactionDetails = async (id: string): Promise<Transaction> => {
  console.log("Fetching transaction details for ID:", id);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  // Example using axios via proxy
  const response = await axios.get(`/api/proxy/transactions/${id}`);
  return response.data;
};

// Dummy action function - replace with your actual API call via proxy
const performTransactionAction = async ({
  id,
  action,
}: {
  id: string;
  action: string;
}) => {
  console.log(`Performing action "${action}" on transaction ID: ${id}`);
  // Example using axios via proxy
  const response = await axios.put(`/api/proxy/transactions/${id}/action`, {
    action,
  });
  return response.data;
};

export default function TransactionDetailsPage({
  params,
}: {
  params: { transactionType: string; transactionId: string };
}) {
  const queryClient = useQueryClient();
  // Get currentUser from auth store
  const currentUser = { id: "user123" }; // Placeholder - replace with actual user

  // Use TanStack Query to fetch transaction details
  const {
    data: transaction,
    isLoading,
    error,
  } = useQuery<Transaction>({
    queryKey: ["transactionDetails", params.transactionId],
    queryFn: () => fetchTransactionDetails(params.transactionId),
    enabled: !!params.transactionId, // Only fetch if ID is available
  });

  // Use TanStack Query mutation for actions
  const mutation = useMutation({
    mutationFn: performTransactionAction,
    onSuccess: () => {
      // Invalidate the query to refetch transaction details after a successful action
      queryClient.invalidateQueries({
        queryKey: ["transactionDetails", params.transactionId],
      });
      // Optionally invalidate transaction lists if the action changes status visible in lists
      queryClient.invalidateQueries({ queryKey: ["transactionList"] });
    },
    onError: (err) => {
      console.error("Transaction action failed:", err);
      // Mutation error is handled internally by useMutation, accessible via mutation.error
    },
  });

  const handleAction = (action: string) => {
    mutation.mutate({ id: params.transactionId, action });
  };

  return (
    <div>
      {/* Pass fetched data and mutation state/handlers to the component */}
      <TransactionDetails
        transaction={transaction as any} // Cast as any for now, refine types later
        loading={isLoading}
        error={error ? error.message : null}
        currentUser={currentUser}
        onAction={handleAction}
      />
      {/* Display mutation error if any */}
      <ErrorMessage error={mutation.error} />
      {/* Display mutation loading state if needed */}
      {mutation.isPending && <div>Performing action...</div>}
    </div>
  );
}
