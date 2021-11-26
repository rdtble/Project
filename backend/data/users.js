const users = require("./index").usersCollection;
const { ObjectId } = require("mongodb");

const addUser = async (firstname, lastname, username, email, password, dob) => {
  const user = new users({
    firstname: firstname,
    lastname: lastname,
    username: username,
    email: email,
    password: password,
    dob: dob,
    userUpvotedPosts: [],
    userDownvotedPosts: [],
    userPosts: [],
  });

  const addedInfo = user.save();
};

const editUserProfile = async (userID, updateParams) => {
  const data = await users.findByIdAndUpdate(
    { _id: ObjectId(userID) },
    updateParams
  );
};

const userAction = async (userID, actionName, postID) => {
  let data = undefined;
  if (actionName === "userCreatedPost") {
    data = await users.findByIdAndUpdate(
      { _id: ObjectId(userID) },
      {
        $addToSet: {
          userPosts: ObjectId(postID),
        },
      }
    );
  } else if (actionName == "userUpvotedPost") {
    data = await users.findByIdAndUpdate(
      { _id: ObjectId(userID) },
      {
        $addToSet: {
          userUpvotedPosts: ObjectId(postID),
        },
        $pullAll: {
          userDownvotedPosts: ObjectId(postID),
        },
      }
    );
  } else if (actionName === "userDownvotedPost") {
    data = await users.findByIdAndUpdate(
      { _id: ObjectId(userID) },
      {
        $addToSet: {
          userDownvotedPosts: ObjectId(postID),
        },
        $pullAll: {
          userUpvotedPosts: ObjectId(postID),
        },
      }
    );
  } else if (userAction === "userDeletesPost") {
    data = await users.findByIdAndUpdate(
      { _id: ObjectId(userID) },
      {
        $pullAll: {
          userPosts: ObjectId(postID),
        },
      }
    );
  } else {
    throw "Error on Database side!! Invalid parameters to userAction method. ";
  }
};

module.exports = {
  addUser,
  editUserProfile,
  userAction,
};

editUserProfile("61a0e7f5ef54cef578e93638", {
  firstname: "HaHA",
  lastname: "Yoyo",
});

// addUser(
//   "Hanish",
//   "Pallapothu",
//   "hanishrohit",
//   "hanishrohit@gmail.com",
//   "password",
//   "02/02/1996"
// ).then((x) => console.log(x));
