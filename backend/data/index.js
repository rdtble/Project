const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/RoundTable");

const postsCollection = mongoose.model("Posts", {
  userPosted: ObjectId,
  title: String,
  description: String,
  date: { type: Date, default: Date.now },
  tags: [String],
  usersUpvoted: [Object],
  usersDownvoted: [Object],
  comments: [Object],
});

const usersCollection = mongoose.model("Users", {
  firstname: String,
  lastname: String,
  username: String,
  email: String,
  password: String,
  dob: String,
});

module.exports = {
  usersCollection,
  postsCollection,
};
