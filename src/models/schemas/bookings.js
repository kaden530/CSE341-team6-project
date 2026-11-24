import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true, trim: true },
        lastName: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        age: { type: Number, min: 0 },
        type: { type: String, trim: true }
    },
    { _id: false }
);

const bookingSchema = new mongoose.Schema(
    {
        tripId: { type: String, required: true, trim: true },
        scheduleId: { type: mongoose.Schema.Types.Mixed, required: true },
        ticketClassId: { type: String, required: true, trim: true },
        passengers: {
            type: [passengerSchema],
            required: true,
            validate: {
                validator: (passengers) => passengers.length > 0 && passengers.length <= 8,
                message: 'A booking must have between 1 and 8 passengers.'
            }
        },
        totalPrice: { type: Number, required: true, min: 0 },
        bookingDate: { type: Date, required: true, default: Date.now },
        status: { type: String, required: true, default: 'confirmed' },
        selectedDay: { type: String, trim: true }
    },
    { collection: 'bookings' }
);

const booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default booking;
