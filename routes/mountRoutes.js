const mountRoutes = (app) => {
  const authRoutes = require("./authRoutes");
  const userRoutes = require("./userRoutes");

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
};

module.exports = mountRoutes;
