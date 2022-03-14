// a function when invoked creates an express application
const express = require("express");
const fs = require("fs");

const app = express();
// middleware -- it can modify the request data -- the body data is added to the request object
app.use(express.json());
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

//route handler -- getting all tours
app.get("/api/v1/tours", (request, response) => {
  response.status(200).json({
    status: "success",
    results: tours.length,
    data: tours,
  });
});

// getting one Tour --- "/api/v1/tours/:id/:name?/:age?"   We can add ? for optional params
app.get("/api/v1/tours/:id", (request, response) => {
  console.log(request.params);

  const id = request.params.id * 1; // because we multiply with an integer the string number will convert to number
  // find will return an array where the condition is true
  // find returns undefined if it cant find anything

  // we dont need to search to see if it exists
  // if the search number is higher than our total tours then we are sure that it doenst exists
  if (id > tours.length) {
    return response.status(404).json({
      status: "fail",
      message: "invalid id",
    });
  }

  const tour = tours.find((el) => el.id === id);

  response.status(200).json({
    status: "success",
    data: { tour },
  });
});

// creating a new tour --- With a post request we can sent data from the client to the server
// and this information is avaliable to the request object
// because out of the box express request doenst contain the body data we need to use middleware
app.post("/api/v1/tours", (request, response) => {
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
});

app.listen(PORT, () => {
  console.log(`Server is listening at Port ${PORT}....`);
});
