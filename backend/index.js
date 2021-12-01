const { ApolloServer, gql } = require("apollo-server");
const redis = require("redis");
const bluebird = require("bluebird");
bluebird.promisifyAll(redis.RedisClient.prototype);
const uuid = require("uuid");
const client = redis.createClient();

const typeDefs = gql`
  type Query {
    getPosts(sortBy: String, pageNum: Int, pageNum: Int): [Post]
    searchPosts(searchTerm: String!): [Post]
    filterPosts(tags: [String]): [Post]
    getUser(username: ID!, password: String!): User
    getPost(id: ID): Post
  }

  type Post {
    id: ID!
    userPosted: String!
    title: String
    description: String!
    tags: [String]
    usersUpvoted: [User]
    usersDownvoted: [User]
    isReply: Boolean
    replies: [Post]
  }

  type User {
    id: ID!
    username: ID!
    firstname: String
    lastname: String
    email: String
    password: String
    userUpvotedPosts: [Post]
    userDownvotedPosts: [Post]
    userPosts: [Post]
  }
  
  type Mutation {
    AddPost(userID: ID!, title: String, description: String!, tags:[String], isReplyToOtherPost:Boolean!, parentPostID: ID): Post
    deletePost(userID:ID!, postID:ID!)
    editDescription(postID:ID!,desciption:String,userID:ID!):Post
    addTagsToPost(postID:ID!,tags:[String],userID:ID!)
    removeTagsFromPost(postID:ID!,tags:[String],userID:ID!)
    userUpVotedPost(postID:ID!, userID:ID!)
    userDownVotedPost(userID: ID!, postID: ID!)    
    AddUser(username: String!, firstname: String!, description: String!): Post
    EditUser(userID:ID!, updateParams:Object)
  }
`;

let resolvers = {
  Query: {
    getPost: async (_, args) => {
      const postID = "post_" + args.id;
      const post = await client.getAsync(postID);
      return JSON.parse(post);
    },
  },
  Mutation: {
    AddPost: async (_, args) => {
      const post = {
        id: uuid.v4(),
        userPosted: args.userPosted,
        title: args.title,
        description: args.description,
        numUpvotes: 0,
        numDownvotes: 0,
        comments: [],
        userShared: [],
      };
      await client.setAsync("post_" + post.id, JSON.stringify(post));
      return post;
    },
  },
};

let args = {
  userPosted: "seed",
  title: "How is web programming 1",
  description: "I would like to know how is web programming 1 by patrick hill",
};

args = {
  id: "45797fd5-b66f-477e-afb9-a387f9b3fb08",
};

console.log(resolvers.Query.getPost(1, args).then((x) => console.log(x)));
