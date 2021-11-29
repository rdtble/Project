const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect("mongodb://localhost:27017/RoundTable");

const postsCollection = mongoose.model("Posts", {
  userPosted: Schema.Types.Mixed,
  title: String,
  description: String,
  date: { type: Date, default: Date.now },
  tags: [String],
  usersUpvoted: [ObjectId],
  usersDownvoted: [ObjectId],
  isReply: Boolean,
  replies: [ObjectId],
});

const usersCollection = mongoose.model("Users", {
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
  userUpvotedPosts: [ObjectId],
  userDownvotedPosts: [ObjectId],
  userPosts: [ObjectId],
});

module.exports = {
  usersCollection,
  postsCollection,
};
