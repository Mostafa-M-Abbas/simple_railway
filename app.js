require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB.....");
  })
  .catch((err) => console.log(err));

const tripRouter = require("./routes/trip.routes")

app.use(express.json());
app.use('/trips', tripRouter);

const PORT = process.env.PORT;

app.listen(PORT || 3000, () => {
  console.log(`Server running on port ${PORT}`);
});
