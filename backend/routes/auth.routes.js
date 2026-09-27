const express = require('express');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registration, OTP verification, and login
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (starts as unverified, OTP sent)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Registered, OTP generated (logged to server console; also returned as devOtp for testing)
 *       400:
 *         description: Missing fields or email already in use
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify the OTP sent at registration and activate the account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOtpInput'
 *     responses:
 *       200:
 *         description: Account verified, returns a JWT
 *       400:
 *         description: Invalid or expired OTP
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: No account found with that email
 */
router.post('/verify-otp', authController.verifyOtp);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend a fresh OTP to an unverified account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResendOtpInput'
 *     responses:
 *       200:
 *         description: New OTP generated (logged to server console; also returned as devOtp)
 *       404:
 *         description: No account found with that email
 */
router.post('/resend-otp', authController.resendOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in with email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Logged in, returns a JWT
 *       401:
 *         description: Incorrect email or password
 *       403:
 *         description: Account not yet verified via OTP
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get the currently logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The logged-in user's profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Not logged in / invalid token
 */
router.get('/me', protect, authController.getMe);

module.exports = router;
