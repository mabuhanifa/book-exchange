export default function BookDetailsPage({
  params,
}: {
  params: { bookId: string };
}) {
  return (
    <div>
      <h1>Book Details for ID: {params.bookId}</h1>
      {/* Book details will go here */}
    </div>
  );
}
