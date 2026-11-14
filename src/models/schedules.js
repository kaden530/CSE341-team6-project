import schedule from "./schemas/schedules.js";

export async function getSchedulesByTripId(tripId, month) {
    const filter = { tripId };

    if (month !== undefined) {
        //ToDo: month filtering depends on what brother Poe says. I sent him a message
        //The schedule data has no month or date field
    }

    return schedule.find(filter).lean();
}