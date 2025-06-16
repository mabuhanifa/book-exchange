# Frontend UI Requirements Specification

This document outlines the requirements for building the frontend UI for the Dhaka Local Book Exchange Marketplace, based on the completed Express.js and Mongoose backend system. The frontend will be built using **Next.js**, styled with **Tailwind CSS**, and utilize **Shadcn UI** components.

## 1. Overall Application Structure & Routing (Next.js)

The application will leverage Next.js for routing, server-side rendering (SSR) or static site generation (SSG) where appropriate, and API route handling for backend interactions. A clear separation between public and private routes will be enforced.

### Routing Structure (Next.js App Router)

- **Public Routes:** Accessible without authentication. Can be Server Components for initial render.

  - `/`: Landing page / Home (can be a Server Component, might show featured books or prompt login/signup)
  - `/auth/register`: User registration flow (Client Component)
  - `/auth/login`: User login flow (Client Component)
  - `/books`: Public book listings browse page (can be Server Component with search/filter in URL params)
  - `/books/[bookId]`: Public single book details page (can be Server Component)
  - `/users/[userId]`: Public user profile page (can be Server Component)
  - `/about`, `/contact`, etc. (Optional static pages, can be Server Components)

- **Private Routes:** Require authentication (valid JWT access token). Access control enforced via Next.js Middleware or checks in Server/Client Components.
  - `/dashboard`: User dashboard (Mix of Server/Client Components)
  - `/profile`: Authenticated user's own profile management (Client Component for forms, Server Component for display)
  - `/profile/edit`: Edit user profile (Client Component)
  - `/profile/my-books`: List of books posted by the user (Mix of Server/Client Components)
  - `/profile/my-reviews`: List of reviews given and received by the user (Mix of Server/Client Components)
  - `/books/new`: Create new book listing (Client Component)
  - `/books/[bookId]/edit`: Edit existing book listing (Owner only, Client Component)
  - `/transactions`: List of all user's transactions (Mix of Server/Client Components)
  - `/transactions/exchange/sent`: List of sent exchange requests (Mix of Server/Client Components)
  - `/transactions/exchange/received`: List of received exchange requests (Mix of Server/Client Components)
  - `/transactions/sell/buying`: List of buy transactions (as buyer) (Mix of Server/Client Components)
  - `/transactions/sell/selling`: List of sell transactions (as seller) (Mix of Server/Client Components)
  - `/transactions/borrow/sent`: List of borrow requests (as borrower) (Mix of Server/Client Components)
  - `/transactions/borrow/received`: List of borrow requests (as owner) (Mix of Server/Client Components)
  - `/transactions/[transactionType]/[transactionId]`: Detailed view of a specific transaction (Mix of Server/Client Components)
  - `/chat`: List of user's conversations (Mix of Server/Client Components)
  - `/chat/[conversationId]`: Specific chat thread view (Mix of Server/Client Components, potentially using Server Actions for sending messages)
  - `/notifications`: User's notification list (Mix of Server/Client Components)
  - `/admin`: Admin dashboard (requires 'admin' role, Mix of Server/Client Components)
  - `/admin/users`: Admin user management list (Mix of Server/Client Components)
  - `/admin/users/[userId]`: Admin view of specific user details (Mix of Server/Client Components)
  - `/admin/books`: Admin book listing management (Mix of Server/Client Components)
  - `/admin/transactions`: Admin view of all transactions (Mix of Server/Client Components)
  - `/admin/disputes`: Admin dispute management list (Mix of Server/Client Components)
  - `/admin/disputes/[disputeId]`: Admin dispute details and resolution (Mix of Server/Client Components)
  - `/admin/reviews`: Admin review moderation list (Mix of Server/Client Components)
  - `/admin/system/logs`: Admin system logs view (Mix of Server/Client Components)
  - `/admin/system/reports`: Admin reports view (Mix of Server/Client Components)

### Dynamic Routes (Next.js App Router)

- `/books/[bookId]`
- `/users/[userId]`
- `/transactions/[transactionType]/[transactionId]`
- `/chat/[conversationId]`
- `/admin/users/[userId]`
- `/admin/disputes/[disputeId]`
- `/admin/reviews/[reviewId]` (if admin can view single review details page)
- `/admin/reports/[reportType]`

## 2. UI Components (React with Shadcn UI & Tailwind CSS)

Leverage Shadcn UI components built on Radix UI and styled with Tailwind CSS for a consistent and accessible design system.

| Component Name          | Purpose                                                                   | Data/Props Needed                                                                                                                   | Relationships                                                                                                 | Shadcn UI / Tailwind Notes                                                                              |
| :---------------------- | :------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| `AppLayout`             | Main layout (Header, Footer, Navigation)                                  | `currentUser` (for conditional rendering), `unreadNotificationCount`                                                                | Contains `Header`, `Footer`, `Navigation`. Wraps other pages.                                                 | Use Tailwind for layout structure (flex, grid).                                                         |
| `Header`                | Site header with logo, navigation links, search, user menu, notifications | `currentUser`, `unreadNotificationCount`                                                                                            | Contains `SearchInput`, `UserMenu`, `NotificationIcon`.                                                       | Use Tailwind for styling. `UserMenu` can use Shadcn `DropdownMenu`. `NotificationIcon` can use `Badge`. |
| `Footer`                | Site footer with links                                                    | -                                                                                                                                   | -                                                                                                             | Use Tailwind for styling.                                                                               |
| `Navigation`            | Main navigation links (conditional based on auth/role)                    | `currentUser`                                                                                                                       | -                                                                                                             | Use Shadcn `NavigationMenu` or simple links with Tailwind styling.                                      |
| `SearchInput`           | Global search bar                                                         | `onSearchSubmit` (callback)                                                                                                         | Used in `Header`.                                                                                             | Use Shadcn `Input` component.                                                                           |
| `UserMenu`              | Dropdown menu for authenticated user (Profile, Logout, Admin link)        | `currentUser`                                                                                                                       | Used in `Header`.                                                                                             | Use Shadcn `DropdownMenu`.                                                                              |
| `NotificationIcon`      | Displays unread notification count, opens notification list               | `unreadCount`, `notifications` (list), `onMarkAsRead`, `onMarkAllRead`                                                              | Used in `Header`. May open `NotificationListModal`.                                                           | Use Shadcn `Badge` for count. Can trigger a `Sheet` or `Dialog`.                                        |
| `NotificationListModal` | Displays recent notifications in a modal/dropdown                         | `notifications`, `onMarkAsRead`, `onMarkAllRead`, `onDeleteNotification`                                                            | Used by `NotificationIcon`.                                                                                   | Use Shadcn `Sheet` (sidebar) or `Dialog` (modal). List items styled with Tailwind.                      |
| `LoginForm`             | Phone number input for login, triggers OTP send                           | `onSubmit` (callback)                                                                                                               | Navigates to `OTPVerificationForm`.                                                                           | Use Shadcn `Form`, `Input`, `Button`. Style with Tailwind.                                              |
| `RegistrationForm`      | Phone number input for registration, triggers OTP send                    | `onSubmit` (callback)                                                                                                               | Navigates to `OTPVerificationForm`.                                                                           | Use Shadcn `Form`, `Input`, `Button`. Style with Tailwind.                                              |
| `OTPVerificationForm`   | OTP input, verifies OTP, completes auth                                   | `phoneNumber`, `userId` (from previous step), `onSubmit` (callback), `onResendOTP` (callback)                                       | Receives data from `LoginForm`/`RegistrationForm`. Redirects on success.                                      | Use Shadcn `Form`, `Input`, `Button`. May need custom OTP input component. Style with Tailwind.         |
| `BookList`              | Displays a list of book cards                                             | `books` (array), `loading`, `error`, `paginationData`, `onPageChange`, `onFilterChange`, `onSortChange`                             | Contains `BookCard`. Uses `Pagination`, `Filter/Sort` components.                                             | Use Tailwind grid/flex for layout. `Filter/Sort` can use Shadcn `Select`, `Checkbox`, `Button`.         |
| `BookCard`              | Displays summary info for a single book listing                           | `book` (object: title, author, condition, type, price/exchange/duration, image, owner name/area, availability)                      | Links to `BookDetailsPage`.                                                                                   | Use Shadcn `Card` component. Style with Tailwind.                                                       |
| `BookDetails`           | Displays full details of a single book                                    | `book` (object), `loading`, `error`, `currentUser`                                                                                  | May contain `TransactionRequestButton`, `ChatButton`.                                                         | Use Tailwind for layout. Images can use Next.js `Image`. Buttons use Shadcn `Button`.                   |
| `BookForm`              | Form for creating or editing a book listing                               | `initialData` (for edit), `onSubmit` (callback), `loading`, `error`                                                                 | Handles image uploads (requires file input).                                                                  | Use Shadcn `Form`, `Input`, `Textarea`, `Select`, `Button`. File input may be custom or a library.      |
| `UserProfilePublic`     | Displays another user's public profile                                    | `user` (object: name, area, bio, image, rating, total reviews), `loading`, `error`                                                  | May contain `UserReviewList`.                                                                                 | Use Tailwind for layout. Display user info.                                                             |
| `UserProfileMe`         | Displays and allows editing of the authenticated user's profile           | `user` (object), `onSubmit` (update callback), `onImageUpload` (callback), `loading`, `error`                                       | Contains `ProfileEditForm`, `ProfileImageUpload`.                                                             | Use Tailwind for layout.                                                                                |
| `ProfileEditForm`       | Form for updating user profile details                                    | `initialData`, `onSubmit`, `loading`, `error`                                                                                       | Used in `UserProfileMe`.                                                                                      | Use Shadcn `Form`, `Input`, `Textarea`, `Select`, `Button`.                                             |
| `ProfileImageUpload`    | Component for uploading/changing profile image                            | `currentImageUrl`, `onImageUpload`, `loading`, `error`                                                                              | Used in `UserProfileMe`.                                                                                      | Use Shadcn `Button`, potentially `Dialog` for cropping/preview. File input.                             |
| `UserBookList`          | Displays books posted by the authenticated user                           | `books` (array), `loading`, `error`, `paginationData`                                                                               | Contains `BookCard`. Uses `Pagination`. Links to `BookForm` (edit).                                           | Use Tailwind layout.                                                                                    |
| `UserReviewList`        | Displays reviews received by or given by a user                           | `reviews` (array), `type` ('received' or 'given'), `loading`, `error`, `paginationData`                                             | Contains `ReviewCard`. Uses `Pagination`.                                                                     | Use Tailwind layout.                                                                                    |
| `ReviewCard`            | Displays a single review                                                  | `review` (object: reviewer/reviewee info, rating, comment, transaction link)                                                        | Links to `UserProfilePublic`, `TransactionDetailsPage`.                                                       | Use Shadcn `Card` or simple div with Tailwind styling. Star rating component needed.                    |
| `ReviewForm`            | Form for submitting a review after a completed transaction                | `transaction` (object), `reviewee` (object), `onSubmit` (callback), `loading`, `error`                                              | Appears after transaction completion.                                                                         | Use Shadcn `Form`, `Textarea`, `Button`. Star rating input component needed.                            |
| `TransactionList`       | Displays a list of transactions (filtered by type/role)                   | `transactions` (array), `type` ('buying', 'selling', 'sent', 'received', 'borrower', 'owner'), `loading`, `error`, `paginationData` | Contains `TransactionCard`. Uses `Pagination`, `Filter` (by status).                                          | Use Tailwind layout.                                                                                    |
| `TransactionCard`       | Displays summary info for a single transaction                            | `transaction` (object: type, status, book info, participant info, dates)                                                            | Links to `TransactionDetailsPage`, `ChatButton`.                                                              | Use Shadcn `Card` or simple div with Tailwind styling.                                                  |
| `TransactionDetails`    | Displays full details of a specific transaction                           | `transaction` (object), `loading`, `error`, `currentUser`                                                                           | Contains action buttons (Accept, Reject, Cancel, Mark Paid, Confirm Completion, Raise Dispute), `ChatButton`. | Use Tailwind layout. Buttons use Shadcn `Button`.                                                       |
| `ChatButton`            | Button to open/navigate to the chat for a transaction                     | `transactionId`, `transactionType`, `participants`                                                                                  | Used in `BookDetails`, `TransactionCard`, `TransactionDetails`.                                               | Use Shadcn `Button`.                                                                                    |
| `ConversationList`      | Displays a list of chat conversations                                     | `conversations` (array, with last message snippet and unread count), `loading`, `error`                                             | Contains `ConversationCard`.                                                                                  | Use Tailwind layout.                                                                                    |
| `ConversationCard`      | Displays summary info for a conversation                                  | `conversation` (object: participants, last message, unread count, transaction link)                                                 | Links to `ChatThreadPage`.                                                                                    | Use Shadcn `Card` or simple div with Tailwind styling.                                                  |
| `ChatThread`            | Displays messages in a conversation, allows sending messages              | `conversationId`, `messages` (array), `loading` (messages), `sending` (message), `error`, `onSendMessage`, `onLoadMoreMessages`     | Contains `MessageBubble`, `MessageInput`. Uses pagination for history.                                        | Use Tailwind flexbox for chat layout. Scrollable message container.                                     |
| `MessageBubble`         | Displays a single chat message                                            | `message` (object: sender, text, timestamp, read status)                                                                            | Used in `ChatThread`. Differentiates sender/receiver.                                                         | Style with Tailwind (background colors, borders, spacing).                                              |
| `MessageInput`          | Input field and send button for chat messages                             | `onSendMessage` (callback), `sending` (boolean)                                                                                     | Used in `ChatThread`.                                                                                         | Use Shadcn `Input`, `Button`.                                                                           |
| `AdminDashboard`        | Displays aggregate system statistics                                      | `stats` (object), `loading`, `error`                                                                                                | -                                                                                                             | Use Tailwind grid/flex for layout. Display stats using simple cards or text.                            |
| `AdminUserList`         | Displays list of all users for admin management                           | `users` (array), `loading`, `error`, `paginationData`, `onFilter/Sort/Search`                                                       | Contains `AdminUserRow`. Uses `Pagination`, `Filter/Sort/Search`.                                             | Use Shadcn `Table` for displaying data.                                                                 |
| `AdminUserRow`          | Displays summary info for a user in admin list                            | `user` (object: all fields), `onSuspend`, `onRestore`                                                                               | Links to `AdminUserDetailsPage`.                                                                              | Table row with Tailwind styling. Buttons use Shadcn `Button`.                                           |
| `AdminUserDetails`      | Displays full details of a user for admin, allows actions                 | `user` (object), `loading`, `error`, `onSuspend`, `onRestore`                                                                       | May display related data (books, transactions, reviews, disputes).                                            | Use Tailwind layout. Display data using simple text or cards. Buttons use Shadcn `Button`.              |
| `AdminBookList`         | Displays list of all books for admin management                           | `books` (array), `loading`, `error`, `paginationData`, `onFilter/Sort/Search`, `onDelete`                                           | Contains `BookCard` (or simplified row). Uses `Pagination`, `Filter/Sort/Search`.                             | Use Shadcn `Table`.                                                                                     |
| `AdminTransactionList`  | Displays list of all transactions for admin viewing                       | `transactions` (array, combined types), `loading`, `error`, `paginationData`, `onFilter/Sort/Search`                                | Contains `TransactionCard` (or simplified row). Uses `Pagination`, `Filter/Sort/Search`.                      | Use Shadcn `Table`.                                                                                     |
| `AdminDisputeList`      | Displays list of disputes for admin management                            | `disputes` (array), `loading`, `error`, `paginationData`, `onFilter/Sort/Search`                                                    | Contains `DisputeCard`. Uses `Pagination`, `Filter/Sort/Search`. Links to `AdminDisputeDetailsPage`.          | Use Shadcn `Table`.                                                                                     |
| `DisputeCard`           | Displays summary info for a dispute                                       | `dispute` (object: transaction link, raised by, status, reason)                                                                     | Links to `AdminDisputeDetailsPage`.                                                                           | Use Shadcn `Card` or simple div with Tailwind styling.                                                  |
| `AdminDisputeDetails`   | Displays full dispute details, allows resolution                          | `dispute` (object), `loading`, `error`, `onResolve` (callback)                                                                      | May display related transaction/chat data.                                                                    | Use Tailwind layout. Resolution form uses Shadcn `Form`, `Textarea`, `Select`, `Button`.                |
| `AdminReviewList`       | Displays list of reviews for admin moderation                             | `reviews` (array), `loading`, `error`, `paginationData`, `onFilter/Sort/Search`, `onModerate`                                       | Contains `ReviewCard` (or simplified row). Uses `Pagination`, `Filter/Sort/Search`.                           | Use Shadcn `Table`.                                                                                     |
| `Pagination`            | Handles page navigation for lists                                         | `currentPage`, `totalPages`, `onPageChange`                                                                                         | Used in any list component.                                                                                   | Use Shadcn `Pagination` component.                                                                      |
| `FilterSortControls`    | Provides UI for filtering and sorting lists                               | `availableFilters`, `availableSorts`, `currentFilters`, `currentSort`, `onFilterChange`, `onSortChange`                             | Used in list components (`BookList`, `AdminUserList`, etc.).                                                  | Use Shadcn `Select`, `Checkbox`, `Button`, `Input` (for search). Style with Tailwind.                   |
| `Modal`                 | Generic modal component                                                   | `isOpen`, `onClose`, `children`                                                                                                     | Used for forms, confirmations, notifications list, etc.                                                       | Use Shadcn `Dialog` component.                                                                          |
| `ConfirmationDialog`    | Generic confirmation modal                                                | `isOpen`, `onClose`, `message`, `onConfirm`                                                                                         | Used for delete actions, transaction cancellations, etc.                                                      | Use Shadcn `AlertDialog` component.                                                                     |
| `LoadingSpinner`        | Visual indicator for loading states                                       | `isLoading`                                                                                                                         | Used in components fetching data.                                                                             | Use a simple spinner component styled with Tailwind.                                                    |
| `ErrorMessage`          | Displays error messages                                                   | `error` (string or object)                                                                                                          | Used in components fetching data or handling form submissions.                                                | Use a simple alert or text component styled with Tailwind.                                              |

## 3. State Management (Next.js)

A centralized state management solution (e.g., Zustand, React Context, Redux Toolkit) is required to manage global or shared application state. Consider server-side data fetching patterns in Next.js (Server Components, `use` hook, React Query/SWR) to minimize client-side state complexity.

Key state areas:

- **Authentication:** `currentUser` (user object), `accessToken`, `refreshToken`, `isAuthenticated`, `authLoading`, `authError`. This state should be accessible globally, potentially managed in a Context Provider or Zustand store.
- **Notifications:** `notifications` (array), `unreadCount`, `notificationsLoading`, `notificationsError`. Global state for real-time updates and display in Header.
- **Global Loading/Error:** Potentially a global indicator for major operations (less critical with per-component loading states).
- **User-specific Data:** User's own books, transactions, reviews. Can be fetched on the relevant pages (potentially in Server Components) and passed down, or managed in local component state/Context/Zustand if needed across components.
- **Admin Data:** Lists of users, books, disputes, etc. Likely fetched per page in Server Components or Client Components using hooks like SWR or React Query.

## 4. Authentication Handling (Next.js)

- **Login/Registration Flow:**
  - User enters phone number in a Client Component form.
  - Submit form data to a Next.js Route Handler (`/api/auth/register` or `/api/auth/login`) or directly to backend API.
  - Navigate to OTP verification page (`/auth/verify-otp`), passing phone number and potentially `userId` via search params or state.
  - User enters OTP in a Client Component form.
  - Submit form data to a Route Handler (`/api/auth/verify-otp`) or backend API.
  - On success, receive `accessToken` and `refreshToken`.
  - Store tokens securely. **Recommendation:** Use HttpOnly cookies set by a Next.js Route Handler or Middleware after successful login/refresh. Avoid storing sensitive tokens in browser Local Storage.
  - Set `isAuthenticated` state (in client-side state management) based on the presence and validity of tokens (checked via API calls or cookie presence). Store `currentUser` data in state.
  - Redirect to a private route (`/dashboard` or `/profile`) using `next/navigation`.
- **Protected Routes:**
  - **Middleware:** Use Next.js Middleware (`middleware.js`) to check for authentication cookies/tokens on incoming requests to protected paths (`/dashboard`, `/profile`, `/admin/*`, etc.). Redirect to `/auth/login` if not authenticated.
  - **Server Components:** In Server Components for private routes, fetch user data based on authentication status (e.g., read cookies). If user data is not found/invalid, redirect using `redirect` from `next/navigation`.
  - **Client Components:** In Client Components within private routes, check authentication state from global state management. If not authenticated, redirect.
  - **Admin Role:** For admin routes (`/admin/*`), check the user's `role` after verifying authentication. Redirect if not 'admin'.
- **API Authentication:**
  - When fetching data in Client Components, use a data fetching library (like SWR or React Query) or a custom fetch wrapper that automatically includes the authentication token (read from cookies or client-side state) in the `Authorization` header.
  - When fetching data in Server Components or Route Handlers, read the authentication cookie from the incoming request headers and include it in the backend API call.
- **Token Refresh:**
  - Implement token refresh logic within your API service layer or data fetching wrapper.
  - If a backend API call returns 401, trigger a refresh request to `/api/auth/refresh-token` (or a Next.js Route Handler that calls the backend refresh endpoint).
  - If refresh is successful, update the authentication cookies/state and retry the original request.
  - If refresh fails, clear authentication state and redirect to login.
- **Logout:** Call `/api/auth/logout` (or a Next.js Route Handler that calls the backend endpoint) to invalidate the refresh token on the server. Clear authentication cookies (e.g., by setting them to expired values in a Route Handler) and client-side state. Redirect to a public route.

## 5. API Integration (Next.js)

Interact with the backend Express.js API (`/api/*`) from Next.js.

- **Server Components:** Fetch data directly in Server Components using `fetch` or a library like `axios`. This is ideal for initial page loads and data that doesn't change frequently based on user interaction. Pass fetched data down to Client Components.
- **Client Components:** Fetch data in Client Components for interactive parts of the UI (forms, buttons, real-time updates) using hooks like `useEffect` or data fetching libraries (SWR, React Query).
- **Route Handlers (App Router) / API Routes (Pages Router):** Create Next.js API endpoints (`/app/api/*` or `/pages/api/*`) to act as a proxy to the backend Express.js API. This can help with:
  - Handling authentication cookies securely.
  - Keeping backend API URL private from the frontend.
  - Implementing server-side logic before calling the backend (e.g., validation, data transformation).
  - Handling file uploads.
- Map UI actions (button clicks, form submissions, page loads) to corresponding API calls (either directly to backend or via Next.js API routes).
- Handle loading states (`loading` boolean) while waiting for API responses.
- Handle error states (`error` variable) and display appropriate messages using the `ErrorMessage` component.
- Use asynchronous functions (`async/await`) for API calls.

Example API mapping:

- `BookList` page (Server Component): Fetches data using `fetch('/api/books?...')` including query parameters from URL search params.
- `BookForm` component (Client Component): Submits data using `axios.post('/api/books', data)` or a custom fetch wrapper.
- `TransactionDetails` page (Mix): Server Component fetches initial transaction data. Client Component buttons trigger actions using `fetch` or `axios` to PUT endpoints.
- `ChatThread` page (Mix): Server Component fetches initial messages. Client Component uses SWR/React Query for real-time updates or polling. Message sending can use a Server Action or a Route Handler.

## 6. Reusable UI Patterns (Shadcn UI & Tailwind CSS)

- **Forms:** Use Shadcn `Form` component with a validation library (e.g., Zod) for structured and validated forms. Style inputs, labels, and error messages with Tailwind.
- **Modals:** Use Shadcn `Dialog` for general modals and `AlertDialog` for confirmations. Style content within modals using Tailwind.
- **Lists:** Display lists using semantic HTML or Shadcn `Table` (especially for admin views). Implement pagination using Shadcn `Pagination`. Filtering and sorting controls use Shadcn `Select`, `Checkbox`, `Input`, `Button` styled with Tailwind.
- **Loading/Error States:** Use conditional rendering based on loading/error state variables. Display `LoadingSpinner` or `ErrorMessage` components styled with Tailwind.
- **Buttons:** Use Shadcn `Button` component for consistent styling and variants (primary, secondary, destructive).
- **Cards:** Use Shadcn `Card` component for displaying grouped information like book summaries or user profiles.

## 7. Specific Feature Requirements (Next.js, Tailwind, Shadcn UI)

- **Pagination:** Manage pagination state (page, limit) in the URL search parameters using `next/navigation` hooks (`useSearchParams`, `useRouter`). Fetch data in Server Components or Client Components based on these params. Display Shadcn `Pagination` component.
- **Search & Filtering:** Implement UI controls using Shadcn components (Input, Select, Checkbox). Update URL search parameters using `next/navigation` hooks. Data fetching components react to URL changes.
- **Validation:** Use a validation library like Zod with Shadcn `Form` for client-side validation. Display validation errors using form state and Tailwind styling. Handle and display backend validation errors returned in API responses.
- **Notifications:**
  - Fetch initial notifications and unread count in a Server Component or Client Component on app load.
  - Implement real-time updates using WebSockets (if backend supports it) in a Client Component, or poll the unread count endpoint periodically.
  - Display unread count using Shadcn `Badge` in the `NotificationIcon`.
  - Display notification list using Shadcn `Sheet` or `Dialog`.
  - Implement actions to mark notifications as read/delete by calling the backend API (potentially via Next.js Route Handlers).
  - Clicking a notification should use `next/navigation` to navigate to the relevant entity's dynamic route.
- **Responsive Design:** Utilize Tailwind CSS utility classes extensively to build responsive layouts and components that adapt to different screen sizes.
- **Image Upload:** Implement file input using standard HTML or a library. Handle upload using `multipart/form-data` submission to a Next.js Route Handler, which then forwards the file to the backend API or storage service. Display uploaded images using Next.js `Image` component.
- **Area Selection:** Use a Shadcn `Select` or `Combobox` component populated with the list of Dhaka areas.

## 8. Admin Panel Considerations (Next.js, Tailwind, Shadcn UI)

- Admin routes must be strictly protected by Next.js Middleware and/or checks in Server/Client Components based on the user's `role`.
- Use Shadcn `Table` for displaying lists of users, books, transactions, disputes, and reviews. Implement server-side pagination, filtering, and sorting by passing parameters to the backend API via URL search params.
- Display dashboard stats using simple cards styled with Tailwind.
- Use Shadcn `Form`, `Textarea`, `Select`, and `Button` for dispute resolution and review moderation forms.
- Implement data fetching for admin details pages (`/admin/users/[userId]`, `/admin/disputes/[disputeId]`) in Server Components.

This updated specification incorporates Next.js, Tailwind CSS, and Shadcn UI, providing a more concrete guide for frontend development using the specified technologies while aligning with the backend structure.
