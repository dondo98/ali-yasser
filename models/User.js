const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  favoriteArticles: {
    type: [
      {
        author: {
          type: String,
          required: false
        },
        title: {
          type: String,
          required: false
        },
        publishedAt: {
          type: Date,
          required: false
        },
        urlToImage: {
          type: String,
          required: false
        },
        description: {
          type: String,
          required: false
        },
        content: {
          type: String,
          required: false
        },
        url: {
          type: String,
          required: false
        }
      }
    ],
    default: [],
    required: false
  },
  favoriteAuthors: {
    type: [
      {
        type: String,
        required: true
      }
    ],
    default: [],
    required: false
  },
  topicsHistory: {
    type: [
      {
        type: String,
        required: true
      }
    ],
    default: [],
    required: false
  }
});

module.exports = User = mongoose.model("User", UserSchema);
