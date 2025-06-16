import Link from "next/link";
// Import Shadcn Card component later
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface Book {
  id: string;
  title: string;
  author: string;
  condition: string;
  type: "exchange" | "sell" | "borrow";
  price?: number;
  exchangeFor?: string;
  borrowDuration?: string;
  image?: string;
  owner?: { name: string; area: string };
  availability: string;
}

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Link href={`/books/${book.id}`}>
      {/* Shadcn Card */}
      <div className="border p-4 rounded-md">
        {/* Card Header */}
        <h3>{book.title}</h3>
        {/* Card Content */}
        <p>by {book.author}</p>
        <p>Condition: {book.condition}</p>
        <p>Type: {book.type}</p>
        {book.type === "sell" && <p>Price: ${book.price}</p>}
        {book.type === "exchange" && <p>Exchange For: {book.exchangeFor}</p>}
        {book.type === "borrow" && <p>Duration: {book.borrowDuration}</p>}
        {/* Image */}
        {book.image && (
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-40 object-cover mt-2"
          />
        )}
        {/* Card Footer */}
        <p className="text-sm mt-2">
          Owner: {book.owner?.name} ({book.owner?.area})
        </p>
        <p className="text-sm">Availability: {book.availability}</p>
      </div>
    </Link>
  );
}
