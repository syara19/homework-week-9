const express = require("express");
const router = express.Router();
const authRouter = require("./auth");
const moviesRouter = require("./movies");
const { authentication } = require("../middlewares/auth");
const userRoutes = require("./users");

router.use("/auth", authRouter);
router.use(authentication);
router.use("/movies", moviesRouter);
router.use("/users", userRoutes);

module.exports = router;
