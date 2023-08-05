const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const salt = bcrypt.genSaltSync(10);
const { generateToken } = require("../lib/jwt");

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, gender, role } = req.body;
    const hashPassword = bcrypt.hashSync(password, salt);
    const user = await prisma.users.create({
      data: {
        id: Math.floor(Math.random() * (1000 - 100) + 100),
        email,
        password: hashPassword,
        gender,
        role,
      },
    });
    console.log(user);
    res.status(201).json({
      message: "user created succesfully",
      email,
      role,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (user === null) throw { name: "ErrorNotFound" };

    const isValid = bcrypt.compareSync(password, user.password);

    if (!isValid) {
      throw { name: "InvalidCredentials" };
    }
    const accessToken = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: "login success",
      accessToken,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
