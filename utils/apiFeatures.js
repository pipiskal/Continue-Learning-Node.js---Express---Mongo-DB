class APIFeatures {
  // we are passing the mongoose query , the actual query that get created from Tour.find()
  // and the queryString that comes from the browser (req.query)
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    // deleting the exluded fields from the main req.query so it wont polute the filtering
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    this.query = this.query.find(queryObj);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      // chaning the query
      // sort can come like {sort : "price"} for ascending order or
      // like that {sort : "-price"} for descending order
      this.query = this.query.sort(sortBy);
      // we can also add a second sort parameter to sort by a second criteria
      // like that : sort(price ratingsAverage) we leave a space between the values
    } else {
      // if user doenst speciafy any sort in the url we provide a default
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      // req.query.fields will give back the string coming from the request
      const selectedFields = this.queryString.fields.split(",").join(" ");
      // query.select('name duration, ratingAverage, difficulty, price')
      this.query = this.query.select(selectedFields);
      // Projection cannot have a mix of inclusion and exclusion
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    console.log(`page is ${page} and limit : ${limit}`);

    // skip () --> the amout of results should be skipped before querying data
    // limit() --> the amount of results we want from the query to send back
    // if (this.queryString.page) {
    //   // we need to awaut cause it returns a promise
    //   const numberTours = await Tour.countDocuments();
    //   if (skip >= numberTours) {
    //     throw new Error("The page that you are looking for doenst exists");
    //   }
    // }
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
