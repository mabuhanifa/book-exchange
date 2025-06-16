# 6. Borrow Module

## Description of Module

This module manages the process of users borrowing books from others. It covers proposing a borrow request, accepting/rejecting, tracking the borrow period, handling overdue books, and confirming return.

## Required Models (Mongoose schemas)

### `BorrowRequest` Model

```javascript
// Borrow Request Schema
const borrowRequestSchema = new mongoose.Schema(
  {
    borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User requesting to borrow
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User who owns the book
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // Book being borrowed
    requestedDuration: { type: Number, required: true, min: 1 }, // Duration in days requested by borrower
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "active",
        "overdue",
        "returned",
        "disputed",
      ],
      default: "pending",
      index: true,
    },
    borrowDate: { type: Date }, // Date when borrowing officially starts (marked by owner)
    dueDate: { type: Date }, // Calculated based on borrowDate and accepted duration
    returnDate: { type: Date }, // Date when book was returned (marked by owner)
    // Completion tracking
    borrowerConfirmedReturn: { type: Boolean, default: false }, // Borrower confirms they returned
    ownerConfirmedReturn: { type: Boolean, default: false }, // Owner confirms they received
  },
  { timestamps: true }
);
```

## Required APIs (express routes)

- `POST /api/borrow-requests`: Create a new borrow request (Borrower initiates).
- `GET /api/borrow-requests/sent`: Get borrow requests sent by the authenticated user (Borrower).
- `GET /api/borrow-requests/received`: Get borrow requests received by the authenticated user (Owner).
- `GET /api/borrow-requests/:requestId`: Get details of a specific borrow request.
- `PUT /api/borrow-requests/:requestId/accept`: Accept a pending borrow request (Owner only). Owner might adjust duration.
- `PUT /api/borrow-requests/:requestId/reject`: Reject a pending borrow request (Owner only).
- `PUT /api/borrow-requests/:requestId/cancel`: Cancel a pending borrow request (Borrower only).
- `PUT /api/borrow-requests/:requestId/mark-borrowed`: Mark the book as handed over and start the borrow period (Owner only). Sets `borrowDate` and `dueDate`.
- `PUT /api/borrow-requests/:requestId/confirm-return`: Mark completion of the return process (Both Borrower and Owner). Sets `returnDate`.

## Business Logic Notes

- Request creation: A user (borrower) requests to borrow a book listed with `transactionType: 'borrow'` and `isAvailable: true`. The requested duration is included.
- Status flow: `pending` -> (`accepted` or `rejected` or `cancelled`) -> `active` -> (`returned` or `overdue` or `disputed`).
- Book availability: When a request is `accepted`, the book's `isAvailable` flag should be set to `false`. If `rejected` or `cancelled`, reset to `true`. Keep `false` while `active`, `overdue`, `disputed`. Reset to `true` when `returned`.
- Borrow period: The owner marks the book as 'borrowed' (`mark-borrowed` API). This sets `borrowDate` and calculates `dueDate` based on the accepted duration.
- Overdue handling: A scheduled job or check should update the status to `overdue` if `dueDate` passes and status is still `active`. Notifications should be sent to both parties.
- Return confirmation: Both borrower and owner must confirm the return for the status to become `returned`. This could trigger review eligibility.
- Notifications: Send notifications for new requests, status changes, and overdue reminders.

## Validation & Security Considerations

- Input validation: Validate request body includes valid book ID and requested duration.
- Authentication: User must be authenticated to create or manage requests.
- Authorization: Ensure only the owner can accept/reject/mark borrowed/confirm return (owner side). Ensure only the borrower can cancel/confirm return (borrower side).
- Book ownership/availability: Verify the book belongs to the owner and is available for borrowing.
- Prevent self-borrow: A user cannot borrow a book from themselves.
- Date handling: Ensure correct calculation of `dueDate`.

## Example Edge Cases

- Book becomes unavailable before the owner accepts.
- User tries to mark as borrowed before the request is accepted.
- User tries to confirm return before the book is marked as borrowed.
- Only one party confirms return.
- Disputes arise (e.g., book damaged on return, borrower refuses to return) (handled in Admin module).
- Scheduled job for overdue check fails or is delayed.

## Database Relationships

- `BorrowRequest` has a many-to-one relationship with `Borrower` (`User`).
- `BorrowRequest` has a many-to-one relationship with `Owner` (`User`).
- `BorrowRequest` has a many-to-one relationship with `Book`.
