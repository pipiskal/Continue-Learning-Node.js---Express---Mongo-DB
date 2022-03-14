const fs = require("fs");
// Getting the data from the js file in the disk
// Converts a JSON String to Javascript Object
const tours = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
const deleteTour = (request, response) => {
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

module.exports = { getAllTours, getTour, createTour, updateTour, deleteTour };
