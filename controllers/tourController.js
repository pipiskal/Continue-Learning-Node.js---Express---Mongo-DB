const Tour = require("./../models/tourModel");

exports.getAllTours = async (req, res) => {
  // since we dont pass anything inside find(),it will bring all the documents back
  // from the specific model --> collection
  try {
    // BUILD QUERY
    // 1)Filtering
    // create a hardcopy of the req.obj and clear it from some parameters so
    // we wont pollute the filtering options
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

    // 2A) ADVANCED FILTERING
    console.log(req.query);
    console.log(queryObj);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    let query = Tour.find(queryObj);

    // 2B) --- SORTING BY PROPERTY
    // if there is a sort query in the incoming requert we want to sort by that
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      // chaning the query
      // sort can come like {sort : "price"} for ascending order or
      // like that {sort : "-price"} for descending order
      query = query.sort(sortBy);
      // we can also add a second sort parameter to sort by a second criteria
      // like that : sort(price ratingsAverage) we leave a space between the values
    } else {
      // if user doenst speciafy any sort in the url we provide a default
      query = query.sort("-createdAt");
    }

    // 2C) --FIELD LIMMITING , We can limit the response to specific return fields
    // Like name, duration , difficulty and price
    if (req.query.fields) {
      // req.query.fields will give back the string coming from the request
      const selectedFields = req.query.fields.split(",").join(" ");
      // query.select('name duration, ratingAverage, difficulty, price')
      query = query.select(selectedFields);
      // Projection cannot have a mix of inclusion and exclusion
    } else {
      query = query.select("-__v");
    }

    // 2D) ---- PAGINATION ---- THE USER SHOULD BE ABLE TO SELECT A SPECIFIC PAGE

    // 3) EXECUTE QUERY
    const tours = await query;

    // 4) SEND RESPONSE
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
