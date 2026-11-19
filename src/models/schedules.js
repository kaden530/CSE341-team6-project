//src/models/schedules.js
import schedule from "./schemas/schedules.js";
import { getDb } from "../db/connect.js";

export async function getSchedulesByTripId(tripId, month) {
    if (month !== undefined) {
        // Temporary: replace with Feature 1's getTripById once it's merged!!!
        const trip = await getDb()
            .collection("trips")
            .findOne({ id: tripId }, { projection: { operatingMonths: 1 } });

        if (!trip?.operatingMonths?.includes(month)) {
            return [];
        }
    }

    return schedule.find({ tripId }).lean();
}