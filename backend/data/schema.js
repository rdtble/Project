const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect("mongodb://localhost:27017/RoundTable");

const postsCollection = mongoose.model("Posts", {
  userPosted: Schema.Types.Mixed,
  title: String,
  description: String,
  date: { type: Date, default: Date.now },
  tags: [String],
  usersUpvoted: [Object],
  usersDownvoted: [Object],
  isReply: Boolean,
  replies: [Object],
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
