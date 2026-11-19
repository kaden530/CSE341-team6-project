// routes/ejs-routes.js
import { Router } from 'express';
import { renderTripList, renderTripDetails } from '../controllers/trips.js';
// ... any other EJS controllers (like home or trains)

const router = Router();

// Trips EJS routes
router.get('/trips', renderTripList);
router.get('/trips/:tripId', renderTripDetails);

export default router;
