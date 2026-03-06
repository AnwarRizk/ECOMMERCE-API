const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

// Load environment variables
dotenv.config({ path: "config.env", quiet: true });
const dbConnection = require("./config/database");
const CategoryModel = require("./models/categoryModel");
const categoryService = require("./services/categoryService");
const categoryRoute = require("./routes/categoryRoute");

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

app.all("*path", (req, res, next) => {
  const err = new Error(`Can't find this route: ${req.originalUrl}`);

  next(err.message);
});

// Global error handling middleware
app.use((err, req, res, next) => {
  res.status(400).json({ err });
});

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
