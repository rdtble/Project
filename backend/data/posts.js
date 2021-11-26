const posts = require("./index").postsCollection;

const { ObjectId } = require("mongodb");

//functions to implement
//addPost
//getPost
//getPosts
//removePost
//addtags, deleteTags, edit title, edit description
//userUpVotedPost
//userDownVotedPost
//filterPost

//SortPost
//CommentPost
//editComment
//DeleteComment

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

//yet to implement sort by feature
const getAndSortPosts = async (pageSize, pageNum, sortBy) => {
  const skip = pageSize * (pageNum - 1);
  data = await posts.find().skip(skip).limit(pageSize);
  return data;
};

const getPostbyID = async (postID) => {
  const data = await posts.find({ _id: ObjectId(postID) });
  return data;
};

const editTitle = async (postID, title, userID) => {
  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      title: title,
    }
  );
};

const editDescription = async (postID, desciption, userID) => {
  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      desciption: desciption,
    }
  );
};

const addTagsToPost = async (postID, tags, userID) => {
  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      $addToSet: {
        tags: { $each: tags },
      },
    }
  );
};

const removeTagsFromPost = async (postID, tags, userID) => {
  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      $pullAll: {
        tags: tags,
      },
    }
  );
};

const userUpVotedPost = async (postID, userID) => {
  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      $addToSet: {
        usersUpvoted: ObjectId(userID),
      },
      $pullAll: {
        usersDownvoted: ObjectId(userID),
      },
    }
  );
};

const userDownVotedPost = async (postID, userID) => {
  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      $addToSet: {
        usersDownvoted: ObjectId(userID),
      },
      $pullAll: {
        usersUpvoted: ObjectId(userID),
      },
    }
  );
};

const fiterPosts = async (tagsToFilter, pageSize, pageNum) => {
  const skip = pageSize * (pageNum - 1);
  const data = await posts
    .find({ tags: { $all: tagsToFilter } })
    .skip(skip)
    .limit(pageSize);
  return data;
};

module.exports = {
  addPost,
  getPosts,
  getPostbyID,
  removeTagsFromPost,
  addTagsToPost,
  editDescription,
  editTitle,
  userDownVotedPost,
  userUpVotedPost,
  fiterPosts,
};

// functions to test

// removeTagsFromPost(
//   "61a0251aca0d7960a313b994",
//   ["helddlo", "ds"],
//   "61a0251aca0d7960a313b993"
// );

// addPost(ObjectId(), "post title", "post desciption", [
//   "data science",
//   "deep learning",
// ]).then((x) => {
//   getPosts();
//   console.log(x);
// });

// getPostbyID("61a0251aca0d7960a313b994").then((x) => console.log(x));
