const express = require("express");
require("dotenv").config();
const connectDB = require("./db/connect");
const mountRoutes = require("./routes/mountRoutes");
const globalErrorHandler = require("./middlewares/globalError");
const swaggerUI = require("swagger-ui-express");
const fs = require("fs");

const swaggerDocument = JSON.parse(fs.readFileSync("./swagger.json", "utf8"));

connectDB();
const app = express();

app.use(express.json());

mountRoutes(app);

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocument, { explorer: true })
);
app.use(globalErrorHandler);

const PORT = process.env.PORT ?? 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger UI is running on http://localhost:${PORT}/api-docs`);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Promise Rejection:", error);
  server.close(() => {
    process.exit(1);
  });
});
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  server.close(() => {
    process.exit(1);
  });
});
