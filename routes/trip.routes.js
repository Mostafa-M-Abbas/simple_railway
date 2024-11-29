const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller')
// Define the routes
router.get("/", tripController.getAllTrips); 
router.post("/", tripController.addTrip);

module.exports = router;
