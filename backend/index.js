const { GraphQLScalarType } = require("graphql");

const {
  ApolloServer,
  gql,
  ApolloError,
  AuthenticationError,
} = require("apollo-server");

//const redis = require("redis");
//const bluebird = require("bluebird");
//bluebird.promisifyAll(redis.RedisClient.prototype);
const uuid = require("uuid");
//const client = redis.createClient();

const userData = require("./data/users");
const postsData = require("./data/posts");

const dateScalar = new GraphQLScalarType({
  name: "Date",
  parseValue(value) {
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
});

const typeDefs = gql`
  scalar Date

  type Query {
    getPost(id: String!): Post
    filterPosts(tags: [String], pageNum: Int, pageSize: Int): [Post]
    getUser(id: String!): User
    getPosts(sortBy: String, pageNum: Int, pageSize: Int): [Post]
  }

  type Post {
    _id: ID!
    userPosted: String
    title: String
    description: String!
    date: Date!
    tags: [String]
    usersUpvoted: [String]
    usersDownvoted: [String]
    isReply: Boolean
    replies: [String]
    parentPost: String
  }

  type User {
    _id: ID!
    firstname: String!
    lastname: String
    username: String!
    email: String!
    userUpvotedPosts: [String]
    userDownvotedPosts: [String]
    userPosts: [String]
  }

  type Mutation {
    signIn(username: String!, password: String!): String
    AddPost(desciption: String!, title: String!, tags: [String]): Post
    AddComment(desciption: String!, parentPostID: String!): Post
    AddUser(
      firstname: String!
      lastname: String!
      username: String!
      email: String!
      password: String!
    ): User
    EditUser(
      firstname: String
      lastname: String
      email: String
      password: String
    ): User
    DeletePost(postID: ID!): Boolean
    EditDescription(postID: ID!, desciption: String): Post
    AddTagsToPost(postID: ID!, tags: [String]!): Post
    RemoveTagsToPost(postID: ID!, tags: [String]!): Post
    UserUpVotedPost(postID: ID!): Post
    UserDownVotedPost(postID: ID!): Post
  }
`;

let resolvers = {
  Date: dateScalar,
  Query: {
    getPost: async (_, args) => {
      try {
        const post = await postsData.getPostbyID(args.id);
        return post;
      } catch (e) {
        console.log(e);
        throw new ApolloError(e, 400);
      }
    },
    filterPosts: async (_, args) => {
      try {
        const filter = await postsData.filterPosts(
          args.tags,
          args.pageSize,
          args.pageNum
        );
        return filter;
      } catch (e) {
        console.log(e);
        throw new ApolloError(e, 400);
      }
    },
    getUser: async (_, __, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const user = await userData.getUserbyID(context.user);
        return user;
      } catch (e) {
        console.log(e);
        throw new ApolloError(e, 400);
      }
    },
    getPosts: async (_, args) => {
      try {
        const posts = await postsData.getAndSortPosts(
          args.pageSize,
          args.pageNum,
          "default"
        );
        console.log(posts);
        return posts;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
  },

  Mutation: {
    signIn: async (_, args, context) => {
      if (context.user === undefined) {
        const userInfo = await userData.getUserbyUserName(args.username);

        if (userInfo.password === args.password) {
          context.user = userInfo._id;
        } else {
          throw new AuthenticationError("username or password is incorrect");
        }
      }
      return context.user;
    },
    AddPost: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const post = await postsData.addPost(
          context.user,
          args.desciption,
          args.tags,
          args.title
        );
        const user = await userData.userAction(
          context.user,
          "userCreatedPost",
          post._id
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    AddComment: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const comment = await postsData.addPost(
          context.user,
          args.desciption,
          ["comment"],
          "",
          true,
          args.parentPostID
        );
        await postsData.addReplytoPost(args.parentPostID, comment._id);
        const user = await userData.userAction(
          context.user,
          "userCreatedPost",
          comment._id
        );
        console.log(comment);
        return comment;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    AddUser: async (_, args) => {
      try {
        const newUser = await userData.addUser(
          args.firstname,
          args.lastname,
          args.username,
          args.email,
          args.password
        );
        return newUser;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    EditUser: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const updateParams = {};

        if (args.firstname !== null) {
          updateParams.firstname = args.firstname;
        }

        if (args.lastname !== null) {
          updateParams.lastname = args.lastname;
        }

        if (args.email !== null) {
          updateParams.email = args.email;
        }

        if (args.password !== null) {
          updateParams.password = args.password;
        }

        const updatedUser = await userData.editUserProfile(
          context.user,
          updateParams
        );

        return updatedUser;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    DeletePost: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const post = await postsData.deletePost(args.postID, context.user);
        const user = await userData.userAction(
          context.user,
          "userDeletesPost",
          args.postID
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    EditDescription: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const post = await postsData.editDescription(
          args.postID,
          args.desciption,
          context.user
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    AddTagsToPost: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const addTags = await postsData.addTagsToPost(
          args.postID,
          args.tags,
          context.user
        );
        return addTags;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    RemoveTagsToPost: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const removeTags = await postsData.removeTagsFromPost(
          args.postID,
          args.tags,
          context.user
        );
        return removeTags;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    UserUpVotedPost: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const post = await postsData.userUpVotedPost(args.postID, context.user);
        const user = await userData.userAction(
          context.user,
          "userUpvotedPost",
          args.postID
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    UserDownVotedPost: async (_, args, context) => {
      try {
        if (context.user === undefined)
          throw new AuthenticationError("you must be logged in");

        const post = await postsData.userDownVotedPost(
          args.postID,
          context.user
        );
        const user = await userData.userAction(
          context.user,
          "userDownvotedPost",
          args.postID
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    return { user: req.headers.authorization };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
