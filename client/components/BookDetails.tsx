import { Button } from "@/components/ui/button";
import Link from "next/link";
import ErrorMessage from "./ui/ErrorMessage";
import LoadingSpinner from "./ui/LoadingSpinner";
// Import Next.js Image later

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  condition: string;
  type: "exchange" | "sell" | "borrow";
  price?: number;
  exchangeFor?: string;
  borrowDuration?: string;
  images?: string[];
  owner?: { id: string; name: string; area: string };
  availability: string;
}

interface BookDetailsProps {
  book: Book;
  loading: boolean;
  error: string | null;
  currentUser: any; // Replace 'any' with actual user type
}

export default function BookDetails({
  book,
  loading,
  error,
  currentUser,
}: BookDetailsProps) {
  if (loading) return <LoadingSpinner isLoading={true} />;
  if (error) return <ErrorMessage error={error} />;
  if (!book) return <div>Book not found.</div>;

  const isOwner = currentUser && currentUser.id === book.owner?.id;

  return (
    <div className="space-y-4">
      <h1>{book.title}</h1>
      <p className="text-lg text-gray-700">by {book.author}</p>
      {/* Images */}
      <div className="flex space-x-2 overflow-x-auto">
        {book.images?.map((img, index) => (
          // Use Next.js Image
          <img
            key={index}
            src={img}
            alt={`${book.title} image ${index + 1}`}
            className="w-64 h-64 object-cover rounded-md"
          />
        ))}
      </div>
      <p>{book.description}</p>
      <p>
        <strong>Condition:</strong> {book.condition}
      </p>
      <p>
        <strong>Type:</strong> {book.type}
      </p>
      {book.type === "sell" && (
        <p>
          <strong>Price:</strong> ${book.price}
        </p>
      )}
      {book.type === "exchange" && (
        <p>
          <strong>Exchange For:</strong> {book.exchangeFor}
        </p>
      )}
      {book.type === "borrow" && (
        <p>
          <strong>Duration:</strong> {book.borrowDuration}
        </p>
      )}
      <p>
        <strong>Owner:</strong> {book.owner?.name} ({book.owner?.area})
      </p>
      <p>
        <strong>Availability:</strong> {book.availability}
      </p>

      {!isOwner && currentUser && (
        <div className="flex space-x-4">
          {/* TransactionRequestButton */}
          <Button>Request Transaction</Button>
          {/* ChatButton */}
          <Button variant="secondary">Chat with Owner</Button>
        </div>
      )}
      {isOwner && (
        <Link href={`/books/${book.id}/edit`}>
          <Button>Edit Listing</Button>
        </Link>
      )}
    </div>
  );
}
