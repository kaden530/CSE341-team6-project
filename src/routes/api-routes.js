
import{    
  getAllTrips,
  getTripById
} from "../controllers/trips.js";
import { Router } from 'express';
import { getAllBookings } from '../controllers/bookings.js';
import { trainsApi } from './trains.js';
import {
    getSchedulesForTrip,
    getSchedulesForTripAndMonth,
} from "../controllers/schedules.js";

import {
  getAllTicketClassesApi,
  getTicketClassesForDayApi,
} from "../controllers/ticket-classes.js";



const router = Router();


router.get('/trains', trainsApi);

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
router.get('/trips', getAllTrips);

//  Api route by ID
/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a single trip by ID
 *     tags: [Trips]
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
router.get('/trips/:id', getTripById);



/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Get all bookings
 *     tags:
 *       - Bookings
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *                 type: object
 *                 required:
 *                   - _id
 *                   - tripId
 *                   - scheduleId
 *                   - ticketClassId
 *                   - passengers
 *                   - totalPrice
 *                   - bookingDate
 *                   - status
 *                 properties:
 *                   _id:
 *                     type: string
 *                   tripId:
 *                     type: string
 *                   scheduleId:
 *                     oneOf:
 *                       - type: string
 *                       - type: integer
 *                   ticketClassId:
 *                     type: string
 *                   passengers:
 *                     type: array
 *                     items:
 *                       type: object
 *                   totalPrice:
 *                     type: number
 *                   bookingDate:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.get('/bookings', getAllBookings);

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
router.get("/trips/:id/schedules", (req, res) =>
    req.query.month !== undefined
        ? getSchedulesForTripAndMonth(req, res)
        : getSchedulesForTrip(req, res)
);

/**
 * @swagger
 * /api/ticket-classes:
 *   get:
 *     summary: Returns ticket classes
 *     description: Returns all ticket classes or ticket classes available for a specific day.
 *     parameters:
 *       - in: query
 *         name: day
 *         schema:
 *           type: string
 *         required: false
 *         description: Day of week
 *     responses:
 *       200:
 *         description: Ticket classes retrieved successfully
 *       500:
 *         description: Server error
 */
router.get("/ticket-classes", async (req, res) => {

  if (req.query.day) {
    return getTicketClassesForDayApi(req, res);
  }

  return getAllTicketClassesApi(req, res);
});

export default router;
