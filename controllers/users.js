const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  HTTP_STATUS,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

const getCurrentUser = (req, res, next) => {
  const userId = req.user && req.user._id;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const userId = req.user && req.user._id;
  const { name, avatar } = req.body;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "Authorization required" });
  }

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError" || err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(200).send(userData);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("User with this email already exists"));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .send({ message: "Email and password are required" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      return res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Incorrect email or password"));
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
