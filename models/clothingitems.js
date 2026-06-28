const mongoose = require("mongoose");

const clothingItemsSchema = new mongoose.Schema({});

module.exports = mongoose.model("item", clothingItemsSchema);
