const { posts, users } = require('../config/mongoCollections');
const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const usersData = data.users;
const postsData = data.posts;