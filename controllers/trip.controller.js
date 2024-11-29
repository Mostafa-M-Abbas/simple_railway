const Trip = require("../models/trip.model");

// GET all trips
function parseDate(dateStr) {
  const [day, month, year] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

const getAllTrips = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      date_from,
      date_till,
      sort,
      departure,
      destination,
    } = req.query;
    //Pagination
    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);
    const skip = (pageNumber - 1) * pageSize;

    //Date Filteration
    const dateFilter = {};
    if (date_from) dateFilter.$gte = parseDate(date_from);
    if (date_till) dateFilter.$lte = parseDate(date_till);

    const query = {};
    if (departure) query.departure = departure;
    if (destination) query.destination = destination;
    if (date_from || date_till) query.startingDate = dateFilter;

    //Sorting
    const sortFields = {};
    if (sort) {
      sort.split(",").forEach((field) => {
        if (field.startsWith("-")) {
          sortFields[field.slice(1)] = -1; // Descending
        } else {
          sortFields[field] = 1; // Ascending
        }
      });
    }
    //Fetch Data
    const trips = await Trip.find(query)
      .sort(sortFields)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

//Add a new trip
const addTrip = async (req, res) => {
  try {
    const {
      departurePlace,
      destination,
      startingDate,
      duration,
      numberOfPassengers,
    } = req.body;
    // Validations
    if (
      !departurePlace ||
      !destination ||
      !startingDate ||
      !duration ||
      !numberOfPassengers
    ) {
      return res
        .status(400)
        .json({ success: false, error: "All fields are required." });
    }

    const parsedDate = parseDate(startingDate);
    if (isNaN(parsedDate)) {
      return res.status(400).json({
        success: false,
        error: "Invalid date format. Use DD-MM-YYYY.",
      });
    }

    if (numberOfPassengers < 2) {
      return res.status(400).json({
        success: false,
        error: "Number of passengers must be greater than 1.",
      });
    }
    const newTrip = new Trip({
      departurePlace,
      destination,
      startingDate: parsedDate,
      duration,
      numberOfPassengers,
    });
    await newTrip.save();
    res.status(201).json({ success: true, data: newTrip });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  getAllTrips,
  addTrip,
};
