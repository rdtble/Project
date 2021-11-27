const posts = require("./schema").postsCollection;
const errorHandling = require("./errors");
const { ObjectId } = require("mongodb");

const addPost = async (
  userID,
  description,
  tags,
  title = "",
  isReply = false
) => {
  errorHandling.checkUserPosted(userID);
  errorHandling.checkString(description, "Desciption");
  errorHandling.checkString(title, "Title", false);
  tags.map((tag) => errorHandling.checkString(tag, "Tag"));

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
  errorHandling.checkStringObjectId(postID, "Post ID");
  errorHandling.checkStringObjectId(replyPostID, "Replied Post ID");

  const data = await posts.updateOne(
    { _id: ObjectId(postID) },
    {
      $addToSet: {
        replies: ObjectId(replyPostID),
      },
    }
  );

  if (data.modifiedCount == 0) {
    throw "Cannot add replied information to the post. ";
  }
};

// delete does not mean deleting the post. It means to make the post description as "deleted" and user_info Anonymous.
//if the same user upVotes or downVotes the post, it will remove
const deletePost = async (postID, userID) => {
  errorHandling.checkStringObjectId(postID, "Post ID");
  errorHandling.checkStringObjectId(userID, "User ID");
  const data = await posts.updateOne(
    {
      _id: ObjectId(postID),
      userPosted: ObjectId(userID),
    },
    {
      description: "Post Deleted",
      userPosted: null,
      $pullAll: {
        usersDownvoted: [ObjectId(userID)],
        usersUpvoted: [ObjectId(userID)],
      },
    }
  );
  if (data.modifiedCount == 0) {
    throw "Cannot delete the post.";
  }
};

//yet to implement sort by feature
const getAndSortPosts = async (pageSize, pageNum, sortBy = "default") => {
  errorHandling.checkInt(pageSize, "Page Size");
  errorHandling.checkInt(pageNum, "Page Number");
  errorHandling.checkString(sortBy, "Sort By");
  if (pageNum < 1) throw "Page number cannot be less than 1";
  if (pageSize < 1) throw "Page size cannot be less than 1";

  const skip = pageSize * (pageNum - 1);
  data = await posts.find().skip(skip).limit(pageSize);
  return data;
};

const getPostbyID = async (postID) => {
  errorHandling.checkStringObjectId(postID, "Post ID");
  const data = await posts.find({ _id: ObjectId(postID) });
  if (data.length === 0) {
    throw "Cannot find a post with the given ID: " + postID;
  }
  return data;
};

const editDescription = async (postID, description, userID) => {
  errorHandling.checkStringObjectId(postID, "Post ID");
  errorHandling.checkString(description, "Desciption");
  errorHandling.checkStringObjectId(userID, "User ID");

  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      description: description,
    }
  );

  if (data.modifiedCount == 0) {
    throw "Cannot update the description of post";
  }
};

const addTagsToPost = async (postID, tags, userID) => {
  errorHandling.checkStringObjectId(postID, "Post ID");
  tags.map((tag) => errorHandling.checkString(tag, "Tag"));
  errorHandling.checkStringObjectId(userID, "User ID");

  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      $addToSet: {
        tags: { $each: tags },
      },
    }
  );
  if (data.modifiedCount == 0) {
    throw "Not Authorized to add a tag";
  }
};

const removeTagsFromPost = async (postID, tags, userID) => {
  errorHandling.checkStringObjectId(postID, "Post ID");
  tags.map((tag) => errorHandling.checkString(tag, "Tag"));
  errorHandling.checkStringObjectId(userID, "User ID");

  const data = await posts.updateOne(
    { _id: ObjectId(postID), userPosted: ObjectId(userID) },
    {
      $pullAll: {
        tags: tags,
      },
    }
  );

  if (data.modifiedCount == 0) {
    throw "Not Authorized to remove a tag";
  }
};

const userUpVotedPost = async (postID, userID) => {
  errorHandling.checkStringObjectId(postID, "Post ID");
  errorHandling.checkStringObjectId(userID, "User ID");

  const data = await posts.updateOne(
    { _id: ObjectId(postID) },
    {
      $addToSet: {
        usersUpvoted: ObjectId(userID),
      },
      $pullAll: {
        usersDownvoted: [ObjectId(userID)],
      },
    }
  );
  if (data.modifiedCount == 0) {
    throw "Cannot up vote a post with ID: " + postID;
  }
};

const userDownVotedPost = async (postID, userID) => {
  errorHandling.checkStringObjectId(postID, "Post ID");
  errorHandling.checkStringObjectId(userID, "User ID");

  const data = await posts.updateOne(
    { _id: ObjectId(postID) },
    {
      $addToSet: {
        usersDownvoted: ObjectId(userID),
      },
      $pullAll: {
        usersUpvoted: [ObjectId(userID)],
      },
    }
  );

  if (data.modifiedCount == 0) {
    throw "Cannot down vote a post with ID: " + postID;
  }
};

const filterPosts = async (tagsToFilter, pageSize = 10, pageNum = 1) => {
  errorHandling.checkInt(pageSize, "Page Size");
  errorHandling.checkInt(pageNum, "Page Number");
  if (pageNum < 1) throw "Page number cannot be less than 1";
  if (pageSize < 1) throw "Page size cannot be less than 1";
  tagsToFilter.map((tag) => errorHandling.checkString(tag, "Tag"));
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
  userDownVotedPost,
  userUpVotedPost,
  filterPosts,
  addReplytoPost,
  deletePost,
};

// Testing

// addReplytoPost("61a15b2db890e3dd124a4259", "61a15b2da890e3dd124a4258");
// deletePost("61a19b59583a2ab211d4b383", "61a19b59583a2ab211d4b382");

// getAndSortPosts(1, 2).then((x) => console.log(x));

// getPostbyID("61a0251aca0d7960a3137994").then((x) => console.log(x));

// editDescription(
//   "61a0251aca0d7960a313b994",
//   "efhgkd",
//   "61a0251aca0d7960a313b993"
// );

// filterPosts(["deep learning"], 2, 0).then((x) => console.log(x));

// addTagsToPost(
//   "61a0251aca0d7960a313b994",
//   ["machine learning", "data science"],
//   "61a0251aca0d7960a313b993"
// );

// userDownVotedPost("61a19b59583a2ab211d4b383", "61a19b59583a2ab211d4b382");
// functions to test

// removeTagsFromPost(
//   "61a0251aca0d7960a313b994",
//   ["helddlo", "ds"],
//   "61a0251aca0d7960a313b993"
// );

// addPost(
//   String(ObjectId()),
//   "post desciption",
//   ["data science", "deep learning"],
//   "post title"
// ).then((x) => {
//   console.log(x);
// });

// getPostbyID("61a0251aca0d7960a313b994").then((x) => console.log(x));
