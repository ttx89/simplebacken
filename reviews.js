const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    review_id: {
        type: String
    },
    reviewcomments: {
        type: String
    },
    rating: {
        type: String
    },
});

// Mongoose will assume there is a collection called the plural of this name (i.e., 'users' in this case).
const Review = mongoose.model("Review", ReviewSchema);

module.exports = Review;
