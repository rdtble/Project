const posts = require("./index").postsCollection;

const { ObjectId } = require("mongodb");

const addPost = async (userID, title, description, tags) => {
  const post = new posts({
    userPosted: userID,
    title: title,
    description: description,
    tags: tags,
    usersUpvoted: [],
    usersDownvoted: [],
    comments: [],
  });

  const addedInfo = await post.save();
};

module.exports = addPost;

addPost(ObjectId(), "post title", "post desciption", [
  "data science",
  "deep learning",
]).then((x) => {
  console.log(x);
});
