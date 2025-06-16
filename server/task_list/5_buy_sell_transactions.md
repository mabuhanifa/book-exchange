# 5. Buy/Sell Transactions Module

## Description of Module

This module handles the process of users buying and selling books. It covers creating a sell order, tracking payment status (mocked as cash on delivery), and marking the transaction as completed or cancelled.

## Required Models (Mongoose schemas)

### `SellTransaction` Model

```javascript
// Sell Transaction Schema
const sellTransactionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User selling the book
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User buying the book
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true }, // Book being sold
    price: { type: Number, required: true, min: 0 }, // Price at the time of transaction
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
      index: true,
    }, // 'pending' when buyer initiates
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    }, // Mocked: 'paid' implies cash on delivery agreed
    // Completion tracking (optional)
    sellerConfirmedCompletion: { type: Boolean, default: false },
    buyerConfirmedCompletion: { type: Boolean, default: false },
  },
  { timestamps: true }
);
```

## Required APIs (express routes)

- `POST /api/sell-transactions`: Create a new sell transaction (Buyer initiates).
- `GET /api/sell-transactions/buying`: Get sell transactions initiated by the authenticated user (Buyer).
- `GET /api/sell-transactions/selling`: Get sell transactions where the authenticated user is the seller.
- `GET /api/sell-transactions/:transactionId`: Get details of a specific sell transaction.
- `PUT /api/sell-transactions/:transactionId/accept`: Accept a pending sell transaction (Seller only).
- `PUT /api/sell-transactions/:transactionId/reject`: Reject a pending sell transaction (Seller only).
- `PUT /api/sell-transactions/:transactionId/cancel`: Cancel a pending sell transaction (Buyer or Seller, depending on status).
- `PUT /api/sell-transactions/:transactionId/confirm-completion`: Mark completion of the transaction (Both Buyer and Seller).
- `PUT /api/sell-transactions/:transactionId/mark-paid`: Mark payment status (Seller only, for COD).

## Business Logic Notes

- Transaction creation: A user (buyer) initiates a transaction for a book listed with `transactionType: 'sell'` and `isAvailable: true`. The price is taken from the book listing at the time of creation.
- Status flow: `pending` -> (`accepted` or `rejected` or `cancelled`) -> `completed`.
- Book availability: When a transaction is `accepted`, the book's `isAvailable` flag should be set to `false`. If `rejected` or `cancelled`, reset to `true`. Keep `false` if `completed`.
- Payment Status (Mocked COD): The `paymentStatus` is simplified. 'pending' initially, 'paid' when the seller confirms they received cash on delivery. This doesn't involve actual payment gateway integration.
- Completion: Both buyer and seller should confirm completion for the status to become `completed`. This could trigger review eligibility.
- Cancellation: Buyer can cancel while `pending`. Seller can cancel while `pending`. After `accepted`, cancellation might require mutual agreement or admin intervention (dispute).
- Notifications: Send notifications to the seller when a new transaction is initiated, and to both parties when the status or payment status changes.

## Validation & Security Considerations

- Input validation: Validate request body includes valid book ID.
- Authentication: User must be authenticated to create or manage transactions.
- Authorization: Ensure only the seller can accept/reject/mark paid. Ensure only participants can confirm completion or cancel (based on status).
- Book ownership/availability: Verify the book belongs to the seller and is available for sale.
- Prevent self-buy: A user cannot buy a book from themselves.

## Example Edge Cases

- Book becomes unavailable before the seller accepts.
- Buyer tries to cancel after the seller has marked it as paid.
- Seller tries to mark as paid before the transaction is accepted.
- User tries to accept/reject a transaction that is not pending.
- Disputes arise (e.g., book condition not as described, payment issues) (handled in Admin module).

## Database Relationships

- `SellTransaction` has a many-to-one relationship with `Seller` (`User`).
- `SellTransaction` has a many-to-one relationship with `Buyer` (`User`).
- `SellTransaction` has a many-to-one relationship with `Book`.
