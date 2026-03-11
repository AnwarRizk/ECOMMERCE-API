/* eslint-disable new-cap */
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Load environment variables
dotenv.config({ path: "config.env", quiet: true });
const apiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
// Route files
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subcategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");

// Load database connection
dbConnection();

const app = express();

// Middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subcategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);

// Handle undefined routes
app.all("*path", (req, res, next) => {
  next(new apiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware (in express)
app.use(globalError);

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle unhandled promise rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.name} - ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
