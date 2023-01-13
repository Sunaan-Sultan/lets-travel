const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
