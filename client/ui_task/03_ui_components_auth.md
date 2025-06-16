# Frontend UI Requirements - 3. Authentication UI Components

This document lists UI components specifically for authentication flows (login, registration, OTP).

## 2. UI Components (React with Shadcn UI & Tailwind CSS)

... (Continuing from overview)

| Component Name          | Purpose                                                            | Data/Props Needed                                                                             | Relationships                                                            | Shadcn UI / Tailwind Notes                                                                      |
| :---------------------- | :----------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------- |
| `UserMenu`              | Dropdown menu for authenticated user (Profile, Logout, Admin link) | `currentUser`                                                                                 | Used in `Header`.                                                        | Use Shadcn `DropdownMenu`.                                                                      |
| `NotificationIcon`      | Displays unread notification count, opens notification list        | `unreadCount`, `notifications` (list), `onMarkAsRead`, `onMarkAllRead`                        | Used in `Header`. May open `NotificationListModal`.                      | Use Shadcn `Badge` for count. Can trigger a `Sheet` or `Dialog`.                                |
| `NotificationListModal` | Displays recent notifications in a modal/dropdown                  | `notifications`, `onMarkAsRead`, `onMarkAllRead`, `onDeleteNotification`                      | Used by `NotificationIcon`.                                              | Use Shadcn `Sheet` (sidebar) or `Dialog` (modal). List items styled with Tailwind.              |
| `LoginForm`             | Phone number input for login, triggers OTP send                    | `onSubmit` (callback)                                                                         | Navigates to `OTPVerificationForm`.                                      | Use Shadcn `Form`, `Input`, `Button`. Style with Tailwind.                                      |
| `RegistrationForm`      | Phone number input for registration, triggers OTP send             | `onSubmit` (callback)                                                                         | Navigates to `OTPVerificationForm`.                                      | Use Shadcn `Form`, `Input`, `Button`. Style with Tailwind.                                      |
| `OTPVerificationForm`   | OTP input, verifies OTP, completes auth                            | `phoneNumber`, `userId` (from previous step), `onSubmit` (callback), `onResendOTP` (callback) | Receives data from `LoginForm`/`RegistrationForm`. Redirects on success. | Use Shadcn `Form`, `Input`, `Button`. May need custom OTP input component. Style with Tailwind. |
