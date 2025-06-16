import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

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
      <Card className="h-full flex flex-col">
        {book.image && (
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-40 object-cover rounded-t-md"
          />
        )}
        <CardHeader>
          <CardTitle className="text-lg">{book.title}</CardTitle>
          <p className="text-sm text-gray-600">by {book.author}</p>
        </CardHeader>
        <CardContent className="flex-grow text-sm">
          <p>Condition: {book.condition}</p>
          <p>Type: {book.type}</p>
          {book.type === "sell" && <p>Price: ${book.price}</p>}
          {book.type === "exchange" && <p>Exchange For: {book.exchangeFor}</p>}
          {book.type === "borrow" && <p>Duration: {book.borrowDuration}</p>}
        </CardContent>
        <CardFooter className="text-xs text-gray-500 flex-col items-start">
          <p>
            Owner: {book.owner?.name} ({book.owner?.area})
          </p>
          <p>Availability: {book.availability}</p>
        </CardFooter>
      </Card>
    </Link>
  );
}
