# 4. Exchange Transactions Module

## Description of Module

This module manages the process of users exchanging books. It covers proposing an exchange, accepting/rejecting requests, and marking the exchange as completed.

## Required Models (Mongoose schemas)

### `ExchangeRequest` Model

```javascript
// Exchange Request Schema
const exchangeRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User initiating the request
    requesterBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    }, // Book offered by requester
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    }, // User who owns the target book
    ownerBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    }, // Book requested from owner
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending",
      index: true,
    },
    message: { type: String, maxlength: 500 }, // Optional message with the request
    // Completion tracking (optional, could be separate)
    requesterConfirmedCompletion: { type: Boolean, default: false },
    ownerConfirmedCompletion: { type: Boolean, default: false },
  },
  { timestamps: true }
);
```

## Required APIs (express routes)

- `POST /api/exchange-requests`: Create a new exchange request.
- `GET /api/exchange-requests/sent`: Get exchange requests sent by the authenticated user.
- `GET /api/exchange-requests/received`: Get exchange requests received by the authenticated user.
- `GET /api/exchange-requests/:requestId`: Get details of a specific exchange request.
- `PUT /api/exchange-requests/:requestId/accept`: Accept a pending exchange request (Owner only).
- `PUT /api/exchange-requests/:requestId/reject`: Reject a pending exchange request (Owner only).
- `PUT /api/exchange-requests/:requestId/cancel`: Cancel a pending exchange request (Requester only).
- `PUT /api/exchange-requests/:requestId/confirm-completion`: Mark completion of the exchange (Both Requester and Owner).

## Business Logic Notes

- Request creation: A user (requester) proposes to exchange one of their books (`requesterBook`) for another user's (owner) book (`ownerBook`). Both books must have `transactionType: 'exchange'` and `isAvailable: true`.
- Book matching suggestions: Basic logic could involve suggesting books in the same area or category. Advanced logic could use user preferences or book metadata.
- Status flow: `pending` -> (`accepted` or `rejected` or `cancelled`) -> `completed`.
- Book availability: When a request is `accepted`, both `requesterBook` and `ownerBook` should have their `isAvailable` flag set to `false`. If the request is `rejected` or `cancelled`, the flags should be reset to `true`.
- Completion: Both parties must confirm completion for the request status to become `completed`. This could trigger review eligibility.
- Notifications: Send notifications to the owner when a new request is received, and to both parties when the status changes.

## Validation & Security Considerations

- Input validation: Validate request body includes valid book IDs.
- Authentication: User must be authenticated to create or manage requests.
- Authorization: Ensure only the owner of the target book can accept/reject. Ensure only the requester can cancel. Ensure only participants can confirm completion.
- Book ownership/availability: Verify that `requesterBook` belongs to the `requester` and `ownerBook` belongs to the `owner`, and both are available for exchange.
- Prevent self-exchange: A user cannot exchange a book with themselves.

## Example Edge Cases

- Requester's book becomes unavailable before the owner accepts.
- Owner's book becomes unavailable before they respond.
- User tries to accept/reject a request that is not pending.
- User tries to cancel a request that is already accepted/rejected/completed.
- Only one party confirms completion.
- Disputes arise during the exchange process (handled in Admin module).

## Database Relationships

- `ExchangeRequest` has a many-to-one relationship with `Requester` (`User`).
- `ExchangeRequest` has a many-to-one relationship with `Owner` (`User`).
- `ExchangeRequest` has a many-to-one relationship with `RequesterBook` (`Book`).
- `ExchangeRequest` has a many-to-one relationship with `OwnerBook` (`Book`).
