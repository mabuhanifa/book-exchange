import React from 'react';
import Link from 'next/link';
// Import Shadcn Table, Pagination, Filter/Sort/Search components later
// Import Shadcn Button later

interface Book {
  id: string;
  title: string;
  author: string;
  type: 'exchange' | 'sell' | 'borrow';
  owner: { id: string; name: string };
  createdAt: string;
  // Add other relevant book fields
}

interface AdminBookListProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  paginationData?: any; // Replace 'any'
  onFilter?: (filters: any) => void; // Replace 'any'
  onSort?: (sort: any) => void; // Replace 'any'
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onDelete?: (bookId: string) => void;
}

export default function AdminBookList({ books, loading, error, paginationData, onFilter, onSort, onSearch, onPageChange, onDelete }: AdminBookListProps) {
  if (loading) return <div>Loading books...</div>;
  if (error) return <div>Error loading books: {error}</div>;

  return (
    <div>
      <h1>Admin Book Management</h1>
      {/* Filter/Sort/Search components */}
      {/* Shadcn Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>
                <Link href={`/books/${book.id}`}>
                  {book.title}
                </Link>
              </td>
              <td>{book.author}</td>
              <td>{book.type}</td>
              <td>
                 <Link href={`/admin/users/${book.owner.id}`}>
                   {book.owner.name}
                 </Link>
              </td>
              <td>{new Date(book.createdAt).toLocaleDateString()}</td>
              <td>
                {onDelete && (
                  {/* Shadcn Button */}
                  <button onClick={() => onDelete(book.id)}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination component */}
    </div>
  );
}
