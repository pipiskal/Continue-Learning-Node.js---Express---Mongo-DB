const express = require("express");
const morgan = require("morgan");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
// FOr the /api/v1/tours use the tourRouter , meaning each request that comes to this
// url it get handled by the tourRouter function, which is basically a router object
// created with new Router() function and its responsible to create a mini app
// capable only of performing middleware and routing functions
// router behaves like middleware itself so we can use it as an argument to app.use()
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
