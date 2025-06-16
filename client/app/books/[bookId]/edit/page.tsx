"use client";

export default function EditBookPage({
  params,
}: {
  params: { bookId: string };
}) {
  return (
    <div>
      <h1>Edit Book Listing for ID: {params.bookId}</h1>
      {/* Edit book form will go here */}
    </div>
  );
}
