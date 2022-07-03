const mongoose = require("mongoose");

const GrabbeditemsSchema = new mongoose.Schema({
  grabber_name: {
    type: String,
    required: true,
  },
  grabbeditem_id: {
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
  address: {
    type: String,
    required: true,
  },
});

// Mongoose will assume there is a collection called the plural of this name (i.e., 'users' in this case).
const Grabbeditem = mongoose.model("Grabbeditem", GrabbeditemsSchema);

module.exports = Grabbeditem;
