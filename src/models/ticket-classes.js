import TicketClass from "./schemas/ticket-classes.js";

export async function getAllTicketClasses() {
  return await TicketClass.find().lean();
}

export async function getTicketClassesForDay(day) {
  return await TicketClass.find({
    availableDays: day.toLowerCase(),
  }).lean();
}