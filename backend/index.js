const { ApolloServer, gql, ApolloError } = require("apollo-server");
//const redis = require("redis");
//const bluebird = require("bluebird");
//bluebird.promisifyAll(redis.RedisClient.prototype);
const uuid = require("uuid");
//const client = redis.createClient();

const userData = require('./data/users');
const postsData = require('./data/posts');

const typeDefs = gql`
  type Query {
    getPost(id: String!): String
    filterPosts(tags: [String]): String
    getUser(id: String!): String
    getPosts(sortBy : String, pageNum: Int, pageSize: Int): String
  }

  type Mutation {
    AddPost(
      userID: ID!
      desciption: String
      title: String
      tags: [String]
    ): String
    AddUser(
      firstname: String
      lastname: String
      username: String
      email: String
      password: String
    ): String
    EditUser(
      userID: ID!
      firstname: String
      lastname: String
      email: String
      password: String
    ): String
    DeletePost(
      userID: ID!
      postID: ID!
    ):String
    EditDescription(
      userID: ID!
      postID: ID!
      desciption: String
    ):String
    AddTagsToPost(
      userID: ID!
      postID: ID!
      tags:[String]!
    ):String
    RemoveTagsToPost(
      userID: ID!
      postID: ID!
      tags:[String]!
    ):String
    UserUpVotedPost(
      userID: ID!
      postID: ID!
    ):String
    UserDownVotedPost(
      userID: ID!
      postID: ID!
    ):String
  }
`;

let resolvers = {
  Query: {
    getPost: async (_, args) => {
      try{
      const post = await postsData.getPostbyID(args.id);
      console.log(post);
      return post;
      }catch(e){
        throw new ApolloError(e,400);
      }
    },
    filterPosts : async (_, args) => {
      try{
        const filter = await postsData.filterPosts(args.tags,10,1);
        return filter;
      }
      catch(e){
        throw new ApolloError(e,400);
      }
    },
    getUser: async (_, args) => {
      try{
      const user = await userData.getUserbyID(args.id);
      return user;
      }catch(e){
        throw new ApolloError(e,400);
      }
    },
    getPosts: async (_, args) => {
      try{
        const posts = await postsData.getAndSortPosts(10,1,"default")
        console.log(posts);
        return posts;
      }
      catch(e){
        throw new ApolloError(e, 400);
      }
    },
  },

  Mutation: {
    AddPost: async (_, args) => {

      try {
        const id = await postsData.addPost(args.userID,args.desciption,args.tags,args.title);
        const user = await userData.userAction(args.userID,"userCreatedPost",id)
        return user;
      }catch(e){
        throw new ApolloError(e,400);
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
      } catch(e){
        throw new ApolloError(e,400);
      }
    },
    EditUser: async (_, args) => {
      try{
        const updatedUser = await userData.editUserProfile(
          args.userID,
          {firstname : args.firstname,
         lastname: args.lastname,
         email: args.email,
         password: args.password}
        );
        return updatedUser;
      }catch(e){
        throw new ApolloError(e, 400);
      }
    },
    DeletePost: async (_, args) => {
      try{
        const post = await postsData.deletePost(
          args.postID,
          args.userID);
        const user = await userData.userAction(args.userID,"userDeletesPost",args.postID)
        return user;
      }catch(e){
        throw new ApolloError(e, 400);
      }
    },
    EditDescription: async(_, args) => {
      try{
        const description = await postsData.editDescription(
          args.postID,
          args.desciption,
          args.userID
          );
        return description;
      }catch(e){
        throw new ApolloError(e, 400);
      }
    },
    AddTagsToPost: async(_, args) => {
      try{
        const addTags = await postsData.addTagsToPost(
          args.postID,
          args.tags,
          args.userID
          );
        return addTags;
      }catch(e){
        throw new ApolloError(e, 400);
      }
    },
    RemoveTagsToPost: async(_, args) => {
      try{
        const removeTags = await postsData.removeTagsFromPost(
          args.postID,
          args.tags,
          args.userID
          );
        return removeTags;
      }catch(e){
        throw new ApolloError(e, 400)
      }
    },
    UserUpVotedPost: async(_, args) => {
      try{
        const upPosts = await postsData.userUpVotedPost(
          args.postID,
          args.userID
          );
          const user = await userData.userAction(args.userID,"userUpvotedPost",args.postID)  
        return user;
      }
      catch(e){
        throw new ApolloError(e, 400);
      }
    },
    UserDownVotedPost: async(_, args) => {
      try{
        const downPosts = await postsData.userDownVotedPost(
          args.postID,
          args.userID
          );
          const user = await userData.userAction(args.userID,"userDownvotedPost",args.postID)
        return user;
      }
      catch(e){
        throw new ApolloError(e, 400);
      }
    }
  },
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`Server running at ${url}`);
});
