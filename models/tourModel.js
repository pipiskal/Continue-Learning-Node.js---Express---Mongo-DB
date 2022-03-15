const mongoose = require("mongoose");

// the data that comes is from the body in a post request
// will not go though if its not declared in the schema

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
});

// // lets create a model our of our schema
// // use uppercase on models
const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;
