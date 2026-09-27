const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

// Every booking route requires a logged-in user.
router.use(protect);

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking a tour, managing seats, cancellation, and admin oversight
 */

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Book a tour (any logged-in user)
 *     description: Atomically checks and decrements seat availability, then creates the booking with a price snapshot.
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingInput'
 *     responses:
 *       201:
 *         description: Booking created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     booking:
 *                       $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Missing fields or not enough seats available
 *       401:
 *         description: Not logged in
 *       404:
 *         description: No tour found with that ID
 *   get:
 *     summary: List all bookings across all users (admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Booking'
 *       403:
 *         description: Not an admin
 */
router.post('/', bookingController.createBooking);

/**
 * @swagger
 * /bookings/my:
 *   get:
 *     summary: Get the logged-in user's own bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The caller's bookings, with tour populated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: number
 *                 data:
 *                   type: object
 *                   properties:
 *                     bookings:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Booking'
 *       401:
 *         description: Not logged in
 */
router.get('/my', bookingController.getMyBookings);

/**
 * @swagger
 * /bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking (owner or admin) — restores the tour's seats
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Booking is already cancelled
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not the owner or an admin
 *       404:
 *         description: No booking found with that ID
 */
router.patch('/:id/cancel', bookingController.cancelBooking);

router.get('/', restrictTo('admin'), bookingController.getAllBookings);

/**
 * @swagger
 * /bookings/{id}/status:
 *   patch:
 *     summary: Manually set a booking's status (admin only) — cancelling restores seats
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateBookingStatusInput'
 *     responses:
 *       200:
 *         description: Booking status updated
 *       400:
 *         description: Invalid status value, or booking already cancelled
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not an admin
 *       404:
 *         description: No booking found with that ID
 */
router.patch('/:id/status', restrictTo('admin'), bookingController.updateBookingStatus);

module.exports = router;
