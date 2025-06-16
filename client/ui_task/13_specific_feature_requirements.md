# Frontend UI Requirements - 13. Specific Feature Requirements

This document details specific feature requirements for the frontend UI.

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
