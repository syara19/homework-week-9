//middleware err handler

const errorHandler = (err, req, res, next) => {
  if (err.name === "ErrorNotFound") {
    res.status(404).json({ message: "error not found" });
  } else if (err.name === "InvalidCredentials") {
    res.status(400).json({ message: "invalid email or password" });
  } else if (err.name === "Unauthenticated") {
    res.status(400).json({ message: "invalid email or password" });
  } else {
    res.status(500).json({ message: "Unauthenticated" });
  }
};

module.exports = errorHandler;
