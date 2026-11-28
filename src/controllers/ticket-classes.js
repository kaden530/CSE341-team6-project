import {
  getAllTicketClasses,
  getTicketClassesForDay,
} from "../models/ticket-classes.js";

export async function getAllTicketClassesApi(
  req,
  res,
) {

  try {     
    const ticketClasses =
      await getAllTicketClasses();

    return res.status(200).json(ticketClasses);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Unable to retrieve ticket classes",
    });
  }
}

export async function getTicketClassesForDayApi(
  req,
  res,
) {
  try {
    const { day } = req.query;

    if (!day) {
      return res.status(400).json({
        message:
          "Day parameter is required",
      });
    }

    const ticketClasses =
      await getTicketClassesForDay(day);

    return res.status(200).json(ticketClasses);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Unable to retrieve ticket classes",
    });
  }
}