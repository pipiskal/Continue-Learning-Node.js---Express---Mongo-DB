// a function when invoked creates an express application
const express = require("express");
const morgan = require("morgan");
const tourRouter = require(`${__dirname}/routes/tourRoutes`);

const app = express();
app.use(morgan("dev"));
// This middleware Function gives us access to the request.body
app.use(express.json());
// This middleware will run on every request to the server
// cause in the use method we dont mount a specific path/URL
// manipulate the request
app.use((request, response, next) => {
  // adding a property called requestTime to the request object so we can use it later
  request.requestTime = new Date().toISOString();
  next();
});

// middleware that is specific to this router
app.use("/api/v1/tours", tourRouter);

module.exports = app;
