const fs = require("fs");
const { nextTick } = require("process");
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

const checkId = (req, res, next, val) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  }
  next();
};

const checkBody = (request, response, next) => {
  if (!request.body.name || !request.body.price) {
    return response.status(400).json({
      status: "Invalid request",
      message: "You should provide name and price to me able to continue",
    });
  }
  next();
};

const getAllTours = (request, response) => {
  response.status(200).json({
    requestedAt: request.requestTime,
    status: "success",
    results: tours.length,
    data: tours,
  });
};
const getTour = (request, response) => {
  console.log(request.params);
  // converting string to number by multiplying the string to number 1
  const id = request.params.id * 1;
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
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
  // when we update an object we send back 200
  response.status(200).json({
    data: { tour: "<Updated tour here>" },
  });
};
const deleteTour = (request, response) => {
  // when we delete an object we send back 204 , and the data is null so we can undestand that it got deleted
  response.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = {
  checkId,
  checkBody,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
