import mongoose from 'mongoose';
import booking from './schemas/bookings.js';

export async function createBooking(bookingData) {
    const newBooking = new booking(bookingData);
    return newBooking.save();
}

export async function getAllBookings() {
    return booking.find({}).sort({ bookingDate: -1 }).lean();
}

export async function getBookingById(id) {
    if (!mongoose.isValidObjectId(id)) {
        return null;
    }

    return booking.findById(id).lean();
}
