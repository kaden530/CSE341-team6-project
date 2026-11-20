import { Router } from 'express';
import { getAllBookings } from '../controllers/bookings.js';
import { trainsApi } from './trains.js';

const router = Router();

router.get('/trains', trainsApi);

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bookings:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Failed to fetch bookings
 */
router.get('/bookings', getAllBookings);

export default router;
