I want you to generate a full-stack backend system plan for a **"Dhaka Local Book Exchange Marketplace"** app using **Express.js** and **Mongoose (MongoDB)**.

You must break the requirements down into **10 detailed .md files**, each file representing a different technical module or component. Each file should contain:

- Description of module
- Required models (Mongoose schemas)
- Required APIs (express routes)
- Business logic notes
- Validation & security considerations
- Example edge cases if applicable
- Any database relationships

---

## 🔥 Full System Description

### App Summary

This app allows users in Dhaka (divided by areas: Dhanmondi, Gulshan, Mirpur, Uttara, etc.) to:

- Exchange used or newly bought books
- Sell books
- Buy books
- Borrow books

Users register via phone number and OTP. All activity is area-based. The system includes:

- Book posting (exchange, sell, borrow)
- Search & filters
- Chat between users
- Transactions
- Borrowing management
- Reviews and ratings
- Notifications
- Dispute resolution
- Admin panel features

Tech stack is:

- Node.js
- Express.js
- Mongoose/MongoDB
- JWT for auth
- WebSockets (for chat)
- REST API structure

---

## 🔨 TASK FILES

Please separate into the following 10 markdown files:

---

### 1️⃣ `1_authentication.md`

- Phone number-based registration & login
- OTP service (generation, expiry, verification)
- JWT token issuing and refreshing
- User roles (user, admin)
- Account security considerations

---

### 2️⃣ `2_user_profiles.md`

- User profile schema
- Create, update, read profile
- Area selection logic
- Profile image upload (file storage logic optional)
- Role-based profile access
- Admin suspension logic

---

### 3️⃣ `3_books_module.md`

- Book listing schema:

  - title, author, edition, condition, transaction type (exchange/sell/borrow)
  - images array
  - expected price, expected exchange book
  - borrow duration
  - availability flag
  - area based filtering

- CRUD APIs for books
- Search & filter APIs
- Pagination, sorting logic

---

### 4️⃣ `4_exchange_transactions.md`

- Propose exchange flow:

  - Book matching suggestions logic (basic logic here)
  - Create exchange request
  - Accept/reject exchange request
  - Mark exchange completed

- Exchange request schema
- Validation considerations

---

### 5️⃣ `5_buy_sell_transactions.md`

- Buying flow:

  - Create sell order
  - Payment status (mocked for now, cash on delivery assumption)
  - Mark sold/completed

- Sell transaction schema
- Buyer/seller roles
- Cancelation handling

---

### 6️⃣ `6_borrow_module.md`

- Borrow request flow
- Accept/reject borrow request
- Borrow start & due date tracking
- Overdue handling
- Borrow request schema
- Borrow return confirmation logic

---

### 7️⃣ `7_chat_system.md`

- Chat schema (embedded or separate collection)
- WebSocket or polling based chat API structure
- Message history pagination
- Secure access (only participants)
- Unread message count logic

---

### 8️⃣ `8_reviews_ratings.md`

- Reviews schema
- Review creation after transaction completion
- User ratings aggregation
- Admin review moderation possibility

---

### 9️⃣ `9_notifications.md`

- Notification schema (system & transactional)
- Create, mark read
- Push notification service (logic stub)
- Notifications for:

  - New message
  - New request
  - Accepted/Rejected request
  - System announcements

---

### 🔟 `10_admin_module.md`

- Admin dashboard APIs
- User management (suspend, restore)
- View disputes
- Resolve disputes
- System logs & reports (basic reporting structure)
- Admin-only APIs security

---

⚠ **Important global considerations for every file:**

- Use Mongoose for modeling.
- Express.js RESTful route structure.
- Proper request validation (Joi, Zod, etc.).
- JWT authentication with middleware.
- Pagination for list APIs.
- Proper error handling and standardized error responses.
- Consistent date fields (`createdAt`, `updatedAt`).
- Role-based access control where needed.

---
