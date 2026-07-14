const mongoose = require("mongoose");
const ClothingItem = require("../models/clothingItems");
const { HTTP_STATUS } = require("../utils/errors");

const createItem = (req, res) => {
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
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      console.error(err);
      res
        .status(HTTP_STATUS.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { imageUrl },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .send({ message: "Requested resource not found" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: "Invalid data" });
      }
      return res
        .status(HTTP_STATUS.SERVER_ERROR)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "User authorization required" });
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Invalid id" });
  }

  return ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner || !item.owner.equals(userId)) {
        return res
          .status(HTTP_STATUS.FORBIDDEN)
          .send({ message: "You do not have permission to delete this item" });
      }

      return item.deleteOne().then(() =>
        res.status(200).send({
          message: "Item deleted successfully",
        })
      );
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: "Invalid id" });
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

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "User authorization required" });
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Invalid id" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: "Invalid id" });
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

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  if (!userId) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .send({ message: "User authorization required" });
  }

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send({ message: "Invalid id" });
  }

  return ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .send({ message: "Invalid id" });
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

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
