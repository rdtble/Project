const users = require("./schema").usersCollection;
const errorHandling = require("./errors");
const { ObjectId } = require("mongodb");

const addUser = async (firstname, lastname, username, email, password) => {
  errorHandling.checkString(firstname, "First Name");
  errorHandling.checkString(lastname, "Last Name");
  errorHandling.checkString(username, "Username");
  errorHandling.checkEmail(email, "Email");
  errorHandling.checkString(password, "Password");

  let existingData = await users.find({ username: username.toLowerCase() });

  if (existingData.length > 0) {
    throw "Username already exists. Try a different username";
  }

  existingData = await users.find({ email: email.toLowerCase() });

  if (existingData.length > 0) {
    throw "Email ID is already registered with a different account. Try with a different Email ID";
  }

  const user = new users({
    firstname: firstname,
    lastname: lastname,
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    password: password,
    userUpvotedPosts: [],
    userDownvotedPosts: [],
    userPosts: [],
  });

  const addedInfo = user.save();
};

const editUserProfile = async (userID, updateParams) => {
  errorHandling.checkStringObjectId(userID, "User ID");
  errorHandling.checkObject(updateParams, "Update parameters");

  let doesParametersExist = false;

  if (updateParams.firstname) {
    errorHandling.checkString(updateParams.firstname, "first name");
    doesParametersExist = true;
  }

  if (updateParams.lastname) {
    errorHandling.checkString(updateParams.lastname, "last name");
    doesParametersExist = true;
  }

  if (updateParams.username) {
    throw "You cannot moidfy a username. ";
  }

  if (updateParams.email) {
    errorHandling.checkEmail(updateParams.email, "Email");
    const existingData = await users.find({ email: updateParams.email });
    if (existingData.length > 0) {
      throw "Couldn't update your profile information. Email ID already exists. Try with an another email.";
    }
    doesParametersExist = true;
  }

  if (updateParams.password) {
    errorHandling.checkString(updateParams.password, "password");
    doesParametersExist = true;
  }

  if (!doesParametersExist) {
    throw "No valid parameters exist in the updateParams";
  }

  const data = await users.updateOne({ _id: ObjectId(userID) }, updateParams);

  if (data.modifiedCount == 0) {
    throw "Cannot edit the user profile.";
  }
};

const userAction = async (userID, actionName, postID) => {
  errorHandling.checkStringObjectId(userID, "User ID");
  errorHandling.checkString(actionName, "USER ACTION");
  errorHandling.checkStringObjectId(postID, "Post ID");

  let data = undefined;
  if (actionName === "userCreatedPost") {
    data = await users.updateOne(
      { _id: ObjectId(userID) },
      {
        $addToSet: {
          userPosts: ObjectId(postID),
        },
      }
    );
  } else if (actionName == "userUpvotedPost") {
    data = await users.updateOne(
      { _id: ObjectId(userID) },
      {
        $addToSet: {
          userUpvotedPosts: ObjectId(postID),
        },
        $pullAll: {
          userDownvotedPosts: [ObjectId(postID)],
        },
      }
    );
  } else if (actionName === "userDownvotedPost") {
    data = await users.updateOne(
      { _id: ObjectId(userID) },
      {
        $addToSet: {
          userDownvotedPosts: ObjectId(postID),
        },
        $pullAll: {
          userUpvotedPosts: [ObjectId(postID)],
        },
      }
    );
  } else if (actionName === "userDeletesPost") {
    data = await users.updateOne(
      { _id: ObjectId(userID) },
      {
        $pullAll: {
          userPosts: [ObjectId(postID)],
          userUpvotedPosts: [ObjectId(postID)],
          userDownvotedPosts: [ObjectId(postID)],
        },
      }
    );
  } else {
    throw "Error on Database side!! Invalid parameters to userAction method. ";
  }

  if (data.modifiedCount == 0) {
    throw "Cannot modify the data with " + actionName;
  }
};

module.exports = {
  addUser,
  editUserProfile,
  userAction,
};

// userAction(
//   "61a183593130f6abfc162ec0",
//   "userDeletesPost",
//   "61a0e6807ab067bfc1e61af7"
// );

// Testing

// editUserProfile("61a183430cfb131c143c8dc9", {
//   password: "helo",
// });

// addUser(
//   "han",
//   "Pallapothu",
//   "hanishrohi",
//   "hpallap1@stvens.edu",
//   "password"
// ).then((x) => console.log(x));
