const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  // since we dont pass anything inside find(),it will bring all the documents back
  // from the specific model --> collection
  try {
    // BUILD QUERY
    // 1)Filtering
    // create a hardcopy of the req.obj so we wont pollute the filtering options
    let queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];

    // deleting the exluded fields from the main req.query
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    // req.params --> {name : "spyros"} : "/:name?" ? => optional;
    // req.query -->  {duration : "5", difficulty : "easy"}

    // mongoDb query = { duration : 5, difficulty : "easy" } --> its the exact same with the req.query

    // 1A) Simple Filtering

    // 1st way to query the database with the query information
    // it seems that the find method will ignore the  query parameters
    // that doenst match the schema

    // when we use await the result of the query the query will execute give the results
    // So if we execute the query we wont be able to chain other methods, so we have to return a query
    // and when we are done with filtering we can execute the query by awaiting

    // How the filter object would look like if we had to check for less than or greater than
    // {difficulty : "easy" , duration : {$gte : 5}}
    // { difficulty: 'easy', duration: { gte: '5' } } --> queryObject
    // so what we have to do is to replace gte or lte or gt or lt with $gtw and etc

    // 2) Advanced Filtering
    console.log(queryObj);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);
    console.log(queryObj);

    const query = Tour.find(queryObj);

    // 2) EXECUTE QUERY
    const tours = await query;

    // 3) SEND RESPONSE
    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({properties-values})
    // newTour.save()
    console.log(req.body);
    // creates a new document , we call created directly to the model
    // Returns a promise
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      error: err,
      errorMessage: err.message,
      errorCode: err.code,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    console.log(req.params.id);
    console.log(req.body);
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // the new updated document will be returned
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    // returns the deleted document
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      action: "Item Deleted",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
