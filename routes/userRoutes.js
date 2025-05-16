const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const {
  createUserValidator,
  updateUserValidator,
  getUserValidator,
  deleteUserValidator,
} = require("../utils/validator/userValidator");

const { protect, restrictTo } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(restrictTo("admin"));
router.route("/").get(getAllUsers).post(createUserValidator, createUser);
router
  .route("/:id")
  .get(getUserValidator, getUser)
  .patch(updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);
module.exports = router;
