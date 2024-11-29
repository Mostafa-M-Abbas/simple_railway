const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    departurePlace: {
        type: String, 
        required:true
    }, 
    destination: {
        type: String,
        required: true
    }, 
    startingDate: {
        type: Date, 
        required:true
    }, 
    duration: {
        type: Number,
        required: true
    }, 
    numberOfPassengers: {
        type: Number,
        required: true, 
        min: 2
    }
})
module.exports = mongoose.model('Trip' , tripSchema)