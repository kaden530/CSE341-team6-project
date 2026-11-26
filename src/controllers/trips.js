//src/controllers/trips.js
import {
  getTripById as findTripById,
  getAllTrips as findAllTrips,
} from "../models/trips.js";
import { getSchedulesByTripId } from "../models/schedules.js";


export async function getTripById(req, res) {
  try {
    const { id } = req.params;

    const trip = await findTripById(id);

    if (!trip) {
      return res.status(404).json({
        error: "Trip not found",
      });
    }

    return res.status(200).json(trip);
  } catch (error) {
    console.error("Error fetching trip:", error);

    return res.status(500).json({
      error: "Failed to fetch trip",
    });
  }
}

export async function getAllTrips(req, res) {
  try {
    const trips = await findAllTrips();

    return res.status(200).json(trips);
  } catch (error) {
    console.error("Error fetching trips:", error);

    return res.status(500).json({
      error: "Failed to fetch trips",
    });
  }
}

export async function renderTripDetails(req, res) {
  try {
        const { tripId } = req.params;
        const details = await findTripById(tripId);

        if (!details) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        details.schedules = await getSchedulesByTripId(tripId);

        return res.status(200).json(details);
    } catch (error) {
        console.error('Error loading trip details:', error);
        return res.status(500).json({ error: 'Failed to load trip details' });
    }
};
export async function renderTripList(req, res) {
  try {
    const trips = await findAllTrips();
    return res.status(200).render('trips/list', { title: 'Scenic Train Trips', trips });
  } catch (error) {
    console.error('Error rendering trip list:', error);
    return res.status(500).json({ error: 'Failed to render trip list' });
  }
};