const mongoose = require("mongoose");

const WisheditemsSchema = new mongoose.Schema({
  grabber_name: {
    type: String,
    required: true,
  },
  wisheditem_id: {
    type: String,
    required: true,
  },
  itemname: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
});

// Mongoose will assume there is a collection called the plural of this name (i.e., 'users' in this case).
const Wisheditem = mongoose.model("Wisheditem", WisheditemsSchema);

module.exports = Wisheditem;
