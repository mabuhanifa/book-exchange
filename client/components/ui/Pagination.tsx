"use client";

// Import Shadcn Pagination components later
// import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Basic pagination logic
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center mt-4">
      {/* Shadcn Pagination */}
      <ul className="flex space-x-1">
        {/* Shadcn PaginationPrevious */}
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            Previous
          </button>
        </li>
        {pages.map((page) => (
          // Shadcn PaginationItem, PaginationLink
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              disabled={currentPage === page}
              className={currentPage === page ? "font-bold" : ""}
            >
              {page}
            </button>
          </li>
        ))}
        {/* Shadcn PaginationNext */}
        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}
