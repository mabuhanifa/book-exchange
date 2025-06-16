# Frontend UI Requirements - 5. User & Review UI Components

This document lists UI components specifically for user profiles and reviews.

## 2. UI Components (React with Shadcn UI & Tailwind CSS)

... (Continuing from previous component lists)

| Component Name       | Purpose                                                         | Data/Props Needed                                                                             | Relationships                                           | Shadcn UI / Tailwind Notes                                                           |
| :------------------- | :-------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | :------------------------------------------------------ | :----------------------------------------------------------------------------------- |
| `UserProfilePublic`  | Displays another user's public profile                          | `user` (object: name, area, bio, image, rating, total reviews), `loading`, `error`            | May contain `UserReviewList`.                           | Use Tailwind for layout. Display user info.                                          |
| `UserProfileMe`      | Displays and allows editing of the authenticated user's profile | `user` (object), `onSubmit` (update callback), `onImageUpload` (callback), `loading`, `error` | Contains `ProfileEditForm`, `ProfileImageUpload`.       | Use Tailwind for layout.                                                             |
| `ProfileEditForm`    | Form for updating user profile details                          | `initialData`, `onSubmit`, `loading`, `error`                                                 | Used in `UserProfileMe`.                                | Use Shadcn `Form`, `Input`, `Textarea`, `Select`, `Button`.                          |
| `ProfileImageUpload` | Component for uploading/changing profile image                  | `currentImageUrl`, `onImageUpload`, `loading`, `error`                                        | Used in `UserProfileMe`.                                | Use Shadcn `Button`, potentially `Dialog` for cropping/preview. File input.          |
| `UserReviewList`     | Displays reviews received by or given by a user                 | `reviews` (array), `type` ('received' or 'given'), `loading`, `error`, `paginationData`       | Contains `ReviewCard`. Uses `Pagination`.               | Use Tailwind layout.                                                                 |
| `ReviewCard`         | Displays a single review                                        | `review` (object: reviewer/reviewee info, rating, comment, transaction link)                  | Links to `UserProfilePublic`, `TransactionDetailsPage`. | Use Shadcn `Card` or simple div with Tailwind styling. Star rating component needed. |
| `ReviewForm`         | Form for submitting a review after a completed transaction      | `transaction` (object), `reviewee` (object), `onSubmit` (callback), `loading`, `error`        | Appears after transaction completion.                   | Use Shadcn `Form`, `Textarea`, `Button`. Star rating input component needed.         |
