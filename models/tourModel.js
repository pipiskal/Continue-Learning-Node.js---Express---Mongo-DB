const mongoose = require("mongoose");

// the data that comes is from the body in a post request
// will not go though if its not declared in the schema

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A tour must have a name"],
    unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, "A tour must have a duration"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "A tour must have a group size"],
  },
  difficulty: {
    type: String,
    required: [true, "A tour must have a difficulty"],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, "A tour must have a price"],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true, // will remove all the white spaces at the beggining and the end of the string
    required: [true, "A tour must have a description"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String, // a reference of the image in the database
    required: [true, "An image Cover is required"],
  },
  images: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now(), // in mongo immidiadle gets converted to todays date from the time stamp
  },
  startDates: {
    type: [Date],
  },
});

// // lets create a model our of our schema
// // use uppercase on models
const Tour = mongoose.model("Tour", toursSchema);

module.exports = Tour;
