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
    const movies = await prisma.movies.findMany({
      skip: Number((page - 1) * limit),
      take: Number(limit),
    });
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const movie = await prisma.movies.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (movie === null) throw { name: "ErrorNotFound" };

    res.status(200).json(movie);
  } catch (err) {
    next(err);
  }
});

router.post("/", authorization, async (req, res, next) => {
  try {
    const { title, genres, year } = req.body;

    await prisma.movies.create({
      data: {
        id: Math.floor(Math.random() * (1000 - 100) + 100),
        title,
        genres,
        year,
      },
    });

    res.status(201).json({ message: "movie created successfully" });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authorization, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, genres, year } = req.body;

    await prisma.movies.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        genres,
        year,
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
    await prisma.movies.delete({
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
