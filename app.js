// a function when invoked creates an express application
const express = require("express");
const morgan = require("morgan");
const tourRouter = require(`${__dirname}/routes/tourRoutes`);
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

// const usersRouter = express.Router();

// for the tourRouter to be able to work like the app we need to use middleware so
// we can add to the app the tourRouter
// the app.use() method can mount specific path as well and we are gonna use that
// middleware that is specific to this router
app.use("/api/v1/tours", tourRouter);

app.listen(PORT, () => {
  console.log(`Server is listening at Port ${PORT}....`);
});
