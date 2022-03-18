const express = require("express");
const tourController = require("./../controllers/tourController");

const router = express.Router();

router.route("/tour-stats").get(tourController.getTourStats);

// router.param('id', tourController.checkID);

// we should prefill the query string with middleware to manipulate the request object
router
  .route("/top-5-destinations")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
