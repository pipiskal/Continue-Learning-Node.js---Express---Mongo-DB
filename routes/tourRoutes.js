const express = require("express");
const {
  checkId,
  checkBody,
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
} = require(`${__dirname}/../controllers/toursController`);

// We want to create a Router for each specific concept
// Creating and Mounting Multiple Routers

// creates a new router Object and returns a new middleware function that has
// access to the request, response and next() method
const router = express.Router();

router.param("id", checkId);

// Instead of using the app.route we want to seperate each route to each own sub App
// So we want to have a main route like : /api/v1/tours and the set the route method
// to whatever we want
// prettier-ignore
router
  .route("/")
  .get(getAllTours)
  .post(checkBody, createTour);
// prettier-ignore
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
