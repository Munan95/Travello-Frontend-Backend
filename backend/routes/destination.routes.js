const express = require('express');
const destinationController = require('../controllers/destination.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: Browsable travel destinations
 */

/**
 * @swagger
 * /destinations:
 *   get:
 *     summary: List all destinations
 *     tags: [Destinations]
 *     responses:
 *       200:
 *         description: List of destinations
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
 *                     destinations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Destination'
 *   post:
 *     summary: Create a destination (admin only)
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DestinationInput'
 *     responses:
 *       201:
 *         description: Destination created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     destination:
 *                       $ref: '#/components/schemas/Destination'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not an admin
 */
router
  .route('/')
  .get(destinationController.getAllDestinations)
  .post(protect, restrictTo('admin'), destinationController.createDestination);

/**
 * @swagger
 * /destinations/{id}:
 *   get:
 *     summary: Get a single destination by ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The destination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     destination:
 *                       $ref: '#/components/schemas/Destination'
 *       404:
 *         description: No destination found with that ID
 *   patch:
 *     summary: Update a destination (admin only)
 *     tags: [Destinations]
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
 *             $ref: '#/components/schemas/DestinationInput'
 *     responses:
 *       200:
 *         description: Destination updated
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not an admin
 *       404:
 *         description: No destination found with that ID
 *   delete:
 *     summary: Delete a destination (admin only)
 *     tags: [Destinations]
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
 *         description: Destination deleted
 *       401:
 *         description: Not logged in
 *       403:
 *         description: Not an admin
 *       404:
 *         description: No destination found with that ID
 */
router
  .route('/:id')
  .get(destinationController.getDestination)
  .patch(protect, restrictTo('admin'), destinationController.updateDestination)
  .delete(protect, restrictTo('admin'), destinationController.deleteDestination);

module.exports = router;
