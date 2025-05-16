const express = require("express");
const {
  register,
  login,
  updateMe,
  getMe,
  logout,
  deleteMe,
} = require("../controllers/authController");

const {
  registerValidator,
  loginValidator,
  updateMeValidator,
} = require("../utils/validator/authValidator");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerValidator, register);

router.post("/login", loginValidator, login);

router.get("/logout", logout);

router.use(protect);

router.get("/me", getMe);

router.patch("/updateMe", updateMeValidator, updateMe);

router.delete("/deleteMe", deleteMe);

module.exports = router;
