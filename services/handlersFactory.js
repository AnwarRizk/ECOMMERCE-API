const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

// Factory function to get all documents
exports.getAll = (Model, options = {}) =>
  asyncHandler(async (req, res) => {
    const filter = options.filter ? options.filter(req) : req.filterObject || {};

    let mongooseQuery = Model.find(filter);
    if (options.populate) {
      mongooseQuery = mongooseQuery.populate(options.populate);
    }

    const apiFeatures = new ApiFeatures(mongooseQuery, req.query, {
      searchFields: options.searchFields,
    })
      .filter()
      .sort()
      .limitFields()
      .search()
      .paginate(options.defaultLimit || 5);

    const documents = await apiFeatures.mongooseQuery;
    res.status(200).json({
      results: documents.length,
      page: apiFeatures.page,
      data: documents,
    });
  });

// Factory function to get one document
exports.getOne = (Model, populateOptions) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let query = Model.findById(id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }

    const document = await query;

    if (!document) {
      return next(new apiError(`No document for this ID: ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

// Factory function to create a document
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({ data: newDocument });
  });

// Factory function to update a document
exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!document) {
      return next(new apiError(`No document for this ID: ${id}`, 404));
    }

    res.status(200).json({ data: document });
  });

// Factory function to delete a document
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new apiError(`No document for this ID: ${id}`, 404));
    }
    res.status(204).send();
  });
