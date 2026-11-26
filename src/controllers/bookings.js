import { getDb } from '../db/connect.js';
import {
    createBooking as saveBooking,
    getAllBookings as findAllBookings,
    getBookingById
} from '../models/bookings.js';

export const bookingPage = async (req, res) => {
    const { scheduleId } = req.params;

    const db = getDb();
    const schedule = await db.collection('schedules').findOne({ id: Number(scheduleId) });
    const trip = await db.collection('trips').findOne({ id: schedule.tripId });
    const ticketClasses = await db.collection('ticketClasses').find({}).toArray();
    const ticketOptions = ticketClasses.map((ticketClass) => ({
        class: ticketClass.class,
        name: ticketClass.name,
        price: trip.distance * ticketClass.pricePerKm,
        amenities: ticketClass.amenities,
        description: ticketClass.description
    }));

    return res.render('trips/book', {
        title: 'Book Trip',
        schedule,
        ticketOptions
    });
};

export const processBookingRequest = async (req, res, next) => {
    try {
        const db = getDb();
        const schedule = await db.collection('schedules').findOne({ id: Number(req.body.scheduleId) });
        const trip = await db.collection('trips').findOne({ id: req.body.tripId });
        const ticketClass = await db.collection('ticketClasses').findOne({ class: req.body.ticketClass });

        if (!schedule || !trip || !ticketClass) {
            return res.status(400).render('errors/500', {
                title: 'Invalid Booking',
                error: 'The selected trip, schedule, or ticket class is invalid.'
            });
        }

        const passengers = req.body.passengers || [];
        const totalPrice = trip.distance * ticketClass.pricePerKm * passengers.length;
        const booking = await saveBooking({
            tripId: req.body.tripId,
            scheduleId: schedule.id,
            ticketClassId: ticketClass.class,
            passengers,
            totalPrice,
            selectedDay: req.body.selectedDay,
            status: 'confirmed'
        });

        return res.redirect(`/trips/confirmation/${booking._id}`);
    } catch (error) {
        return next(error);
    }
};

export const bookingConfirmationPage = async (req, res, next) => {
    try {
        const confirmation = await getBookingById(req.params.bookingId);
        if (!confirmation) {
            return res.status(404).render('errors/404', {
                title: 'Booking Not Found',
                error: 'Booking not found'
            });
        }

        return res.render('trips/confirm', {
            title: 'Trip Confirmation',
            confirmation
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await findAllBookings();
        return res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const bookingsAdminPage = (req, res) => {
    return res.render('bookings', { title: 'Bookings Admin' });
};
