// a function when invoked creates an express application
const express = require("express");
const fs = require("fs");
const morgan = require("morgan");
const app = express();

//  1) MIDDLEWARES
/* 
middleware -- it can modify the request data -- the body data is added to the request object
the use method is what we actually use to run middleware
use helps us to ADD midlewear in our middlewear stack
Here expres.json() return a function that gets added to the middleware stack
and we can use it

We can create our own middleware by using app.use((req,res,next)=> { // whatever we want in here // next();})
middleware functions run everytime the server gets a request
NEVER FORGET TO USE NEXT IN THE MIDDLEWARE
*/
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

const PORT = 3000;
// Converts a JSON String to Javascript Object
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`,
    "utf-8",
    (err) => {
      console.log(err);
    }
  )
);
const getAllTours = (request, response) => {
  response.status(200).json({
    requestedAt: request.requestTime,
    status: "success",
    results: tours.length,
    data: tours,
  });
};
const getTour = (request, response) => {
  const id = request.params.id * 1; // because we multiply with an integer the string number will convert to number
  // we dont need to search to see if it exists
  // if the search number is higher than our total tours then we are sure that it doenst exists
  if (id > tours.length - 1) {
    return response.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  // find will return an array where the condition is true
  // find returns undefined if it cant find anything
  const tour = tours.find((el) => el.id === id);
  console.log(tour);
  response.status(200).json({
    status: "success",
    data: { tour },
  });
};
const createTour = (request, response) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, request.body);
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      if (error) console.log(error);
      // 201 --> created
      response.status(201).json({
        status: "success",
        data: tours[tours.length - 1],
      });
    }
  );
};
const updateTour = (request, response) => {
  const id = request.params.id * 1;
  if (id > tours.length) {
    return response.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  // when we update an object we send back 200
  response.status(200).json({
    data: { tour: "<Updated tour here>" },
  });
};
const deteleTour = (request, response) => {
  const id = request.params.id * 1;
  if (id > tours.length) {
    return response.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }
  // when we delete an object we send back 204 , and the data is null so we can undestand that it got deleted
  response.status(204).json({
    status: "success",
    data: null,
  });
};

/*
//route handler -- getting all tours
app.get("/api/v1/tours", getAllTours);
// getting one Tour --- "/api/v1/tours/:id/:name?/:age?"   We can add ? for optional params
app.get("/api/v1/tours/:id", getTour);
// creating a new tour --- With a post request we can sent data from the client to the server
// and this information is avaliable to the request object
// because out of the box express request doenst contain the body data we need to use middleware
app.post("/api/v1/tours", createTour);
// update data
// WITH PUT WE EXPECT THE THE APLICATION WILL RECEIVE THE ENTIRE NEW OBJECT
// WITH PATCH EXPECTS TO RECIEVE ONLY THE PROPERTIES THAT WE WANT TO UPDATE
app.patch("/api/v1/tours/:id", updateTour);
app.delete("/api/v1/tours/:id", deteleTour);
*/

//we can replace the above routing with the following using --- app.route("route in here")

// ---------------ROUTES------------------

// We want to create a Router for each specific concept
// Creating and Mounting Multiple Routers

// creates a new router Object and returns a new middleware function that has
// access to the request, response and next() method
const tourRouter = express.Router();
const usersRouter = express.Router();

// for the tourRouter to be able to work like the app we need to use middleware so
// we can add to the app the tourRouter
// the app.use() method can mount specific path as well and we are gonna use that
// middleware that is specific to this router
app.use("/api/v1/tours", tourRouter);

// Instead of using the app.route we want to seperate each route to each own sub App
// So we want to have a main route like : /api/v1/tours and the set the route method
// to whatever we want
// prettier-ignore
tourRouter
  .route("/")
  .get(getAllTours)
  .post(createTour);
// prettier-ignore
tourRouter
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deteleTour);

app.listen(PORT, () => {
  console.log(`Server is listening at Port ${PORT}....`);
});
