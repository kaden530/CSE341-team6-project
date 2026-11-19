import {
    getAllTrips,
    getTripById
} from "../controllers/trips.js";
import { Router } from 'express';

const router = Router();

//example 
/**
 * @swagger
 * components:
 *   schemas:
 *     Trip:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated MongoDB ID of the trip
 *           example: 65a1b2c3d4e5f67890123456
 *         id: 
 *           type: string
 *           description: The auto-generated MongoDB ID of the trip
 *           example:
 *         description: 
 *           type: string
 *           description: A brief description of the trip
 *           example: Experience the beauty of the Rockies on this scenic journey
 *         region: 
 *           type: string
 *           description: Trip destination
 *           example: Banff, AB
 *         startStation:
 *           type: string
 *           description: Trip starting point
 *           example: Banff, AB
 *         endStation: 
 *           type: string
 *           description: Trip destination
 *           example: Jasper, AB
 *         duration: 
 *           type: string
 *           description: The duration of the trip
 *           example: 5 days
 *         distance: 
 *           type: number
 *           description: The distance of the trip
 *           example: 100
 *         highlights: 
 *           type: string
 *           description: Key highlights of the trip
 *           example: Spectacular mountain views, pristine lakes, and wildlife encounters
 *         bestSeason: 
 *           type: string
 *           description: The best time of year to visit the destination
 *           example: Summer
 *         operatingMonths: 
 *           type: string
 *           description: Months when the trip is available
 *           example: June - August
 *         imageUrl: 
 *           type: string
 *           description: URL of an image representing the trip
 *           example: https://example.com/images/rocky-mountain-express.jpg
 *         imageAlt: 
 *           type: string
 *           description: Alt text for the trip image
 *           example: A scenic view of the Rocky Mountains
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message describing what went wrong
 */



// return all trips
/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Retrieve a list of all trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: A JSON array of trip objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Server error while fetching trips
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Failed to fetch trips
 */
router.get('/api/trips', getAllTrips);

//  Api route by ID
/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a single trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The MongoDB ObjectId of the trip
 *         example: 65a1b2c3d4e5f67890123456
 *     responses:
 *       200:
 *         description: The requested trip object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Trip not found
 *       500:
 *         description: Server error while fetching the trip
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               error: Failed to fetch trip
 */
router.get('/api/trips/:id', getTripById);

export default router;