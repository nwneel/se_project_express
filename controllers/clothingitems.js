const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const {
  HTTP_STATUS,
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user && req.user._id;

  if (!owner) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "Owner information is required" });
  }

  return ClothingItem.create({
    name,
    weather,
    imageUrl,
    owner,
  })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => next(err));
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "User authorization required" });
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid id"));
  }

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner || !item.owner.equals(userId)) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }

      return item.deleteOne().then(() =>
        res.status(200).send({
          message: "Item deleted successfully",
        })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "User authorization required" });
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid id"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "User authorization required" });
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return next(new BadRequestError("Invalid id"));
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid id"));
      }
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Requested resource not found"));
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
