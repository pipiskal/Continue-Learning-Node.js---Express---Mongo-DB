const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_LOCAL;

mongoose.connect(DB, (err) => {
  if (!err) console.log("db connected");
  else console.log("db error");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});
