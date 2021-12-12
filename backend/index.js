const { GraphQLScalarType } = require("graphql");

const { ApolloServer, gql, ApolloError } = require("apollo-server");

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
    AddPost(
      userID: ID!
      desciption: String!
      title: String!
      tags: [String]
    ): Post
    AddComment(userID: ID!, desciption: String!, parentPostID: String!): Post
    AddUser(
      firstname: String!
      lastname: String!
      username: String!
      email: String!
      password: String!
    ): User
    EditUser(
      userID: ID!
      firstname: String
      lastname: String
      email: String
      password: String
    ): User
    DeletePost(userID: ID!, postID: ID!): Boolean
    EditDescription(userID: ID!, postID: ID!, desciption: String): Post
    AddTagsToPost(userID: ID!, postID: ID!, tags: [String]!): Post
    RemoveTagsToPost(userID: ID!, postID: ID!, tags: [String]!): Post
    UserUpVotedPost(userID: ID!, postID: ID!): Post
    UserDownVotedPost(userID: ID!, postID: ID!): Post
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
    getUser: async (_, args) => {
      try {
        const user = await userData.getUserbyID(args.id);
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
    AddPost: async (_, args) => {
      try {
        const post = await postsData.addPost(
          args.userID,
          args.desciption,
          args.tags,
          args.title
        );
        const user = await userData.userAction(
          args.userID,
          "userCreatedPost",
          post._id
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    AddComment: async (_, args) => {
      try {
        console.log(args.parentPostID);
        const comment = await postsData.addPost(
          args.userID,
          args.desciption,
          ["comment"],
          "",
          true,
          args.parentPostID
        );
        await postsData.addReplytoPost(args.parentPostID, comment._id);
        const user = await userData.userAction(
          args.userID,
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
    EditUser: async (_, args) => {
      try {
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
          args.userID,
          updateParams
        );

        console.log(updatedUser);
        return updatedUser;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    DeletePost: async (_, args) => {
      try {
        const post = await postsData.deletePost(args.postID, args.userID);
        const user = await userData.userAction(
          args.userID,
          "userDeletesPost",
          args.postID
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    EditDescription: async (_, args) => {
      try {
        const post = await postsData.editDescription(
          args.postID,
          args.desciption,
          args.userID
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    AddTagsToPost: async (_, args) => {
      try {
        const addTags = await postsData.addTagsToPost(
          args.postID,
          args.tags,
          args.userID
        );
        return addTags;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    RemoveTagsToPost: async (_, args) => {
      try {
        const removeTags = await postsData.removeTagsFromPost(
          args.postID,
          args.tags,
          args.userID
        );
        return removeTags;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    UserUpVotedPost: async (_, args) => {
      try {
        const post = await postsData.userUpVotedPost(args.postID, args.userID);
        const user = await userData.userAction(
          args.userID,
          "userUpvotedPost",
          args.postID
        );
        return post;
      } catch (e) {
        throw new ApolloError(e, 400);
      }
    },
    UserDownVotedPost: async (_, args) => {
      try {
        const post = await postsData.userDownVotedPost(
          args.postID,
          args.userID
        );
        const user = await userData.userAction(
          args.userID,
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

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server running at ${url}`);
});
