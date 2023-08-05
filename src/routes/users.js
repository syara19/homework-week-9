const express = require("express");
const router = express.Router();
const { authorization } = require("../middlewares/auth");
const {
  PrismaClient,
  PrismaClientKnownRequestError,
} = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const users = await prisma.users.findMany({
      skip: Number((page - 1) * limit),
      take: Number(limit),
      select: {
        id: true,
        email: true,
        gender: true,
        role: true,
      },
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await prisma.users.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        email: true,
        gender: true,
        role: true,
      },
    });
    if (user === null) throw { name: "ErrorNotFound" };

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

router.post("/", authorization, async (req, res, next) => {
  try {
    const { email, gender, role, password } = req.body;

    await prisma.users.create({
      data: {
        id: Math.floor(Math.random() * (1000 - 100) + 100),
        email,
        password,
        gender,
        role,
      },
    });

    res.status(201).json({ message: "user created successfully" });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authorization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, password, role } = req.body;

    await prisma.users.update({
      where: {
        id: Number(id),
      },
      data: {
        email,
        password,
        role,
      },
    });
    res.status(200).json({ message: "data updated successfully" });
  } catch (err) {
    //*error handle
    // if (err instanceof PrismaClientKnownRequestError) {
    //   if (err.code === "P2025") {
    //     throw { name: "ErrorNotFound" };
    //   }
    // }
    next(err);
  }
});

router.delete("/:id", authorization, async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.users.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json({ message: "data deleted successfully" });
  } catch (err) {
    //*error handle
    // if (err instanceof PrismaClientKnownRequestError) {
    //   if (err.code === "P2025") {
    //     throw { name: "ErrorNotFound" };
    //   }
    // }

    next(err);
  }
});

module.exports = router;
