import railTripsRouter from './trips.js';
import { trainsPage } from './trains.js';
import apiRoutes from './api-routes.js';
import { Router } from 'express';
import { homePage, aboutPage, testErrorPage } from './index.js';
import { bookingsAdminPage } from '../controllers/bookings.js';
import apiRoutes from './api-routes.js';


const router = Router();

// Home page
router.get('/', homePage);

// About page
router.get('/about', aboutPage);

// Trains page
router.get('/trains', trainsPage);

// API routes
router.use('/api', apiRoutes);

// Bookings admin page
router.get('/bookings-admin', bookingsAdminPage);

// Schedules API
router.use(apiRoutes);

// Rail trips
router.use('/trips', railTripsRouter);

// Test 500 error page
router.get('/500', testErrorPage);

export default router;