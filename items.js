const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  expiredate: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  winner: {
    type: String,
    required: false,
  },
});

// Mongoose will assume there is a collection called the plural of this name (i.e., 'users' in this case).
const Item = mongoose.model("Item", ItemSchema);

module.exports = Item;
