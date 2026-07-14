const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { HTTP_STATUS } = require("../utils/errors");

const getCurrentUser = (req, res) => {
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
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateUserProfile = (req, res) => {
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
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const createUser = (req, res) => {
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
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      if (err.code === 11000) {
        return res
          .status(HTTP_STATUS.CONFLICT)
          .send({ message: "User with this email already exists" });
      }
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
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
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(HTTP_STATUS.UNAUTHORIZED)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};
