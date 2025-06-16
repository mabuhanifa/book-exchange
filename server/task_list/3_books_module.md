# 3. Books Module

## Description of Module

This module handles the creation, management, and retrieval of book listings posted by users. Listings include details about the book, its condition, transaction type (exchange, sell, borrow), and availability.

## Required Models (Mongoose schemas)

### `Book` Model

```javascript
// Book Schema
const bookSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    author: { type: String },
    edition: { type: String },
    condition: {
      type: String,
      enum: ["New", "Like New", "Very Good", "Good", "Acceptable"],
      required: true,
    },
    description: { type: String, maxlength: 1000 },
    transactionType: {
      type: String,
      enum: ["exchange", "sell", "borrow"],
      required: true,
      index: true,
    },
    images: [{ type: String }], // Array of image URLs
    // Fields specific to transaction types
    expectedPrice: {
      type: Number,
      min: 0,
      required: function () {
        return this.transactionType === "sell";
      },
    },
    expectedExchangeBook: {
      type: String,
      required: function () {
        return this.transactionType === "exchange";
      },
    }, // e.g., "Any novel", "Specific book title"
    borrowDuration: {
      type: Number,
      min: 1,
      required: function () {
        return this.transactionType === "borrow";
      },
    }, // Duration in days
    // Availability and location
    isAvailable: { type: Boolean, default: true, index: true }, // False when a transaction is active/completed
    area: { type: String, required: true, index: true }, // Inherited from owner's profile area
    // Status (optional, could be derived or explicit)
    status: {
      type: String,
      enum: ["active", "pending", "completed", "cancelled"],
      default: "active",
    }, // 'pending' when transaction initiated
  },
  { timestamps: true }
);
```

## Required APIs (express routes)

- `POST /api/books`: Create a new book listing.
- `GET /api/books`: Get a list of all active book listings (with filters, search, pagination).
- `GET /api/books/:bookId`: Get details of a specific book listing.
- `PUT /api/books/:bookId`: Update a specific book listing (Owner only).
- `DELETE /api/books/:bookId`: Delete a specific book listing (Owner only).
- `GET /api/users/me/books`: Get listings created by the authenticated user.

## Business Logic Notes

- Area filtering: Listings should primarily be filtered by the user's selected area. Users might have an option to view listings in nearby areas.
- Availability: `isAvailable` flag should be set to `false` when a transaction (exchange, sell, borrow) involving this book is initiated and set back to `true` if the transaction is cancelled or fails, or kept `false` if completed.
- Image handling: Implement multi-image upload. Store URLs in the `images` array.
- Conditional fields: `expectedPrice`, `expectedExchangeBook`, and `borrowDuration` should only be required and validated based on the `transactionType`.
- Search & Filter: Implement full-text search on title, author, description. Allow filtering by transaction type, condition, area.
- Pagination & Sorting: Implement pagination for list views. Allow sorting by date, price (for sell), etc.

## Validation & Security Considerations

- Input validation: Validate all fields based on type, format, and constraints (e.g., price >= 0, valid condition/type enum). Ensure required fields for specific transaction types are present.
- Authentication: User must be authenticated to create, update, or delete listings.
- Authorization: Ensure only the owner of a book listing can update or delete it. Admins might have override capabilities (handled in Admin module).
- Area consistency: Automatically set the book's area based on the owner's profile area.
- Image upload security: Validate image formats, sizes, and quantity.

## Example Edge Cases

- User tries to create a 'sell' listing without an `expectedPrice`.
- User tries to update a listing that is currently involved in an active transaction.
- User tries to update/delete a listing they do not own.
- Search query returns too many results (pagination needed).
- Filtering by a non-existent area.

## Database Relationships

- `Book` has a many-to-one relationship with `User` (many books belong to one owner).
- `Book` will be referenced by transaction models (`Exchange`, `Sell`, `Borrow`).
