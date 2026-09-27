const express = require('express');
const tourController = require('../controllers/tour.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tours
 *   description: Bookable tour packages, each tied to a destination
 */

/**
 * @swagger
 * /tours:
 *   get:
 *     summary: List all tours, optionally filtered by destination
 *     tags: [Tours]
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Filter tours by destination ObjectId
 *     responses:
 *       200:
 *         description: List of tours (destination populated with name/slug/region)
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
 *                     tours:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Tour'
 *   post:
 *     summary: Create a tour under a destination (admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TourInput'
 *     responses:
 *       201:
 *         description: Tour created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     tour:
 *                       $ref: '#/components/schemas/Tour'
 *       400:
 *         description: Missing fields or destination ID does not exist
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not an admin
 */
router
  .route('/')
  .get(tourController.getAllTours)
  .post(protect, restrictTo('admin'), tourController.createTour);

/**
 * @swagger
 * /tours/{id}:
 *   get:
 *     summary: Get a single tour by ID (destination fully populated)
 *     tags: [Tours]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The tour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     tour:
 *                       $ref: '#/components/schemas/Tour'
 *       404:
 *         description: No tour found with that ID
 *   patch:
 *     summary: Update a tour (admin only)
 *     tags: [Tours]
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
 *             $ref: '#/components/schemas/TourInput'
 *     responses:
 *       200:
 *         description: Tour updated
 *       400:
 *         description: destination ID does not exist
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not an admin
 *       404:
 *         description: No tour found with that ID
 *   delete:
 *     summary: Delete a tour (admin only)
 *     tags: [Tours]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Tour deleted
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not an admin
 *       404:
 *         description: No tour found with that ID
 */
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(protect, restrictTo('admin'), tourController.updateTour)
  .delete(protect, restrictTo('admin'), tourController.deleteTour);

module.exports = router;
