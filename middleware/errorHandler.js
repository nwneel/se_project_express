const { HTTP_STATUS } = require("../utils/errors");

const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || HTTP_STATUS.SERVER_ERROR;
  const message = err.message || "An error has occurred on the server.";

  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
