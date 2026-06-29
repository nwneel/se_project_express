const ClothingItem = require("../models/clothingItems");

const createItem = (req, res) => {
  const { name, weather, imageUrl, imageURL } = req.body;
  const owner = req.user && req.user._id;

  if (!owner) {
    return res.status(401).send({ message: "Owner information is required" });
  }

  ClothingItem.create({
    name,
    weather,
    imageURL,
    owner,
  })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      res
        .status(500)
        .send({ message: "Error creating item", error: err.message });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error fetching items", error: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl, imageURL } = req.body;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { imageUrl: imageUrl || imageURL },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      res
        .status(500)
        .send({ message: "Error updating item", error: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(204).send({}))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      res
        .status(500)
        .send({ message: "Error deleting item", error: err.message });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  if (!userId) {
    return res.status(401).send({ message: "User authorization required" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      res
        .status(500)
        .send({ message: "Error liking item", error: err.message });
    });
};

const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user && req.user._id;

  if (!userId) {
    return res.status(401).send({ message: "User authorization required" });
  }

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Item not found" });
      }
      res
        .status(500)
        .send({ message: "Error unliking item", error: err.message });
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
