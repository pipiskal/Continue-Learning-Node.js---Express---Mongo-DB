const { app, express } = require("./server");
const morgan = require("morgan");
const tourRouter = require(`${__dirname}/routes/tourRoutes`);

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

/* the app.use works lie that
we can mount a URl and in needs a callback function with specific parameters like below

app.use("any base url you want or Nothing" , (request, response, next)=> {
  // You can do anything you want in the middeware function 
  // but we always have to call next

})
The above callback function will if the request comes with the exact same url that we bounted in the app.use() method
*/
app.use("/api/v1/tours", tourRouter);

// app.use("/api/v1/users");
