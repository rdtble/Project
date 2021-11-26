const posts = require("./index").postsCollection;

const { ObjectId } = require("mongodb");

const addPost = async (
  userID,
  description,
  tags,
  title = "",
  isReply = false
) => {
  const post = new posts({
    userPosted: ObjectId(userID),
    title: title,
    description: description,
    tags: tags,
    usersUpvoted: [],
    usersDownvoted: [],
    isReply: isReply,
    replies: [],
  });

  const addedInfo = await post.save();
};

const addReplytoPost = async (postID, replyPostID) => {
  const data = await posts.findByIdAndUpdate(
    { _id: ObjectId(postID) },
    {
      $addToSet: {
        replies: ObjectId(replyPostID),
      },
    }
  );
};

const deletePost = async (postID, userID) => {
  const data = await posts.findByIdAndUpdate(
    {
      _id: ObjectId(postID),
      userPosted: ObjectId(userID),
    },
    {
      description: "Post Deleted",
      userPosted: null,
    }
  );
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
    { _id: ObjectId(postID) },
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
    { _id: ObjectId(postID) },
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
  getAndSortPosts,
  getPostbyID,
  removeTagsFromPost,
  addTagsToPost,
  editDescription,
  editTitle,
  userDownVotedPost,
  userUpVotedPost,
  fiterPosts,
  addReplytoPost,
  deletePost,
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
