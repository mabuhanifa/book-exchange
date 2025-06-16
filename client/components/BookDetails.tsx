// Import Shadcn Button later
// Import Next.js Image later

interface Book {
  id: string;
  title: string;
  author: string;
  description: string; // Added description for details
  condition: string;
  type: "exchange" | "sell" | "borrow";
  price?: number;
  exchangeFor?: string;
  borrowDuration?: string;
  images?: string[]; // Added multiple images for details
  owner?: { id: string; name: string; area: string }; // Added owner id
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
  if (loading) return <div>Loading book details...</div>;
  if (error) return <div>Error loading book details: {error}</div>;
  if (!book) return <div>Book not found.</div>;

  const isOwner = currentUser && currentUser.id === book.owner?.id;

  return (
    <div>
      <h1>{book.title}</h1>
      <p>by {book.author}</p>
      {/* Images */}
      {book.images?.map((img, index) => (
        // Use Next.js Image
        <img
          key={index}
          src={img}
          alt={`${book.title} image ${index + 1}`}
          className="w-64 h-64 object-cover mr-2"
        />
      ))}
      <p>Description: {book.description}</p>
      <p>Condition: {book.condition}</p>
      <p>Type: {book.type}</p>
      {book.type === "sell" && <p>Price: ${book.price}</p>}
      {book.type === "exchange" && <p>Exchange For: {book.exchangeFor}</p>}
      {book.type === "borrow" && <p>Duration: {book.borrowDuration}</p>}
      <p>
        Owner: {book.owner?.name} ({book.owner?.area})
      </p>
      <p>Availability: {book.availability}</p>

      {!isOwner && currentUser && (
        <div>
          {/* TransactionRequestButton */}
          {/* Shadcn Button */}
          <button>Request Transaction</button>
          {/* ChatButton */}
          {/* Shadcn Button */}
          <button>Chat with Owner</button>
        </div>
      )}
      {isOwner && (
        <Link href={`/books/${book.id}/edit`}>
          {/* Shadcn Button */}
          <button>Edit Listing</button>
        </Link>
      )}
    </div>
  );
}
