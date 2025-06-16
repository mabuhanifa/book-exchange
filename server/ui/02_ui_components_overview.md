# Frontend UI Requirements - 2. UI Components Overview

This document introduces the UI components used in the frontend, leveraging React with Shadcn UI and Tailwind CSS, and lists general layout components.

## 2. UI Components (React with Shadcn UI & Tailwind CSS)

Leverage Shadcn UI components built on Radix UI and styled with Tailwind CSS for a consistent and accessible design system.

| Component Name | Purpose                                                                   | Data/Props Needed                                                    | Relationships                                                 | Shadcn UI / Tailwind Notes                                                                              |
| :------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------ |
| `AppLayout`    | Main layout (Header, Footer, Navigation)                                  | `currentUser` (for conditional rendering), `unreadNotificationCount` | Contains `Header`, `Footer`, `Navigation`. Wraps other pages. | Use Tailwind for layout structure (flex, grid).                                                         |
| `Header`       | Site header with logo, navigation links, search, user menu, notifications | `currentUser`, `unreadNotificationCount`                             | Contains `SearchInput`, `UserMenu`, `NotificationIcon`.       | Use Tailwind for styling. `UserMenu` can use Shadcn `DropdownMenu`. `NotificationIcon` can use `Badge`. |
| `Footer`       | Site footer with links                                                    | -                                                                    | -                                                             | Use Tailwind for styling.                                                                               |
| `Navigation`   | Main navigation links (conditional based on auth/role)                    | `currentUser`                                                        | -                                                             | Use Shadcn `NavigationMenu` or simple links with Tailwind styling.                                      |
| `SearchInput`  | Global search bar                                                         | `onSearchSubmit` (callback)                                          | Used in `Header`.                                             | Use Shadcn `Input` component.                                                                           |
