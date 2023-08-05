const { verifyToken } = require("../lib/jwt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const authentication = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    const { id, email, role } = verifyToken(accessToken);
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user === null) throw { name: "Unauthenticated" };

    req.loggedUser = {
      id: id,
      email: email,
      role: role,
    };
    next();
  } catch (err) {
    next(err);
  }
};

const authorization = (req, res, next) => {
  try {
    const { role } = req.loggedUser;

    if (role === "admin") {
      next();
    } else {
      throw { name: "Unauthorized" };
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  authorization,
  authentication,
};
