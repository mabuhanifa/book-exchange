const express = require("express");
const {
  getUserProfile,
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
} = require("../controllers/userController");
const {
  getUserReviews,
  getMyGivenReviews,
} = require("../controllers/reviewController"); // Correct import path for review functions
const { protect } = require("../middlewares/authMiddleware");
// const upload = require('../middlewares/uploadMiddleware'); // Assuming Multer or similar

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile management and public profiles
 */

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get a specific user's public profile
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the user to get
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User' # Using the basic User schema
 *       404:
 *         description: User not found or not public
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:userId", getUserProfile);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get the authenticated user's own profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user's profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   $ref: '#/components/schemas/User' # Using the basic User schema
 *       401:
 *         description: Not authorized (missing or invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update the authenticated user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               area:
 *                 type: string
 *                 example: "Gulshan"
 *               bio:
 *                 type: string
 *                 example: "Book lover from Gulshan."
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Profile updated successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/User' # Return updated user data
 *       400:
 *         description: Invalid input or cannot update sensitive fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.route("/me").get(protect, getMyProfile).put(protect, updateMyProfile);

/**
 * @swagger
 * /users/me/profile-image:
 *   post:
 *     summary: Upload/update profile image for the authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *                 description: The profile image file to upload.
 *     responses:
 *       200:
 *         description: Profile image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Profile image uploaded successfully" }
 *                 profileImageUrl: { type: string, example: "http://example.com/images/user123.jpg" }
 *       400:
 *         description: No file uploaded or invalid file type/size
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error or upload failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// router.post('/me/profile-image', protect, upload.single('profileImage'), uploadProfileImage); // Example with Multer
router.post("/me/profile-image", protect, uploadProfileImage); // Placeholder without Multer

/**
 * @swagger
 * /users/{userId}/reviews:
 *   get:
 *     summary: Get reviews received by a specific user
 *     tags: [Users, Reviews] # Tagged under both Users and Reviews
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema: { type: string }
 *         required: true
 *         description: ID of the user whose received reviews to get
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Reviews received by the user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 10 }
 *                 total: { type: integer, example: 50 }
 *                 page: { type: integer, example: 1 }
 *                 pages: { type: integer, example: 5 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review' # Reviews received by this user
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:userId/reviews", getUserReviews); // Correct function is now imported

/**
 * @swagger
 * /users/me/reviews/given:
 *   get:
 *     summary: Get reviews written by the authenticated user
 *     tags: [Users, Reviews] # Tagged under both Users and Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Reviews written by the user retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 8 }
 *                 total: { type: integer, example: 8 }
 *                 page: { type: integer, example: 1 }
 *                 pages: { type: integer, example: 1 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review' # Reviews written by this user
 *       401:
 *         description: Not authorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me/reviews/given", protect, getMyGivenReviews); // Correct function is now imported

// --- Admin User Management (Placeholder - Full logic in Task 10) ---
// Note: Admin user routes are in adminRoutes.js

module.exports = router;
