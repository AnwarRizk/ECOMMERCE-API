class ApiFeatures {
  constructor(mongooseQuery, queryString, options = {}) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
    this.options = options;
    this.page = 1;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludeFields = ["page", "sort", "limit", "fields", "keyword"];

    excludeFields.forEach((field) => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const searchFields = this.options.searchFields || ["title", "description"];
      const keywordConditions = searchFields.map((field) => ({
        [field]: { $regex: this.queryString.keyword, $options: "i" },
      }));

      this.mongooseQuery = this.mongooseQuery.find({
        $or: keywordConditions,
      });
    }

    return this;
  }

  paginate(defaultLimit = 50) {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || defaultLimit;
    const skip = (page - 1) * limit;

    this.page = page;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
