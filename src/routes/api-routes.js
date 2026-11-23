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
import {
    getSchedulesForTrip,
    getSchedulesForTripAndMonth,
} from "../controllers/schedules.js";
import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /api/trips/{id}/schedules:
 *   get:
 *     summary: Get the schedules for a trip
 *     tags:
 *       - Schedules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The trip id, such as alpine-panorama
 *         schema:
 *           type: string
 *       - in: query
 *         name: month
 *         required: false
 *         description: Month number from 1 to 12. When provided, only schedules for that month are returned.
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *     responses:
 *       200:
 *         description: Schedules returned successfully (an empty array if the trip has none)
 *       400:
 *         description: The month is not a whole number from 1 to 12
 *       500:
 *         description: Failed to fetch schedules
 */
router.get("/api/trips/:id/schedules", (req, res) =>
    req.query.month !== undefined
        ? getSchedulesForTripAndMonth(req, res)
        : getSchedulesForTrip(req, res)
);
  
export default router;
