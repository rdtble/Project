import { gql } from '@apollo/client';

const SIGN_IN = gql`
	mutation SignIn($username: String!, $password: String!) {
		signIn(username: $username, password: $password)
	}
`;

const GET_USER_INFO = gql`
	query GetUser {
		getUserInfo {
			firstname
			lastname
			username
		}
	}
`;

const GET_POSTS = gql`
	query Query($pageSize: Int, $pageNum: Int, $sortBy: String) {
		getPosts(pageSize: $pageSize, pageNum: $pageNum, sortBy: $sortBy) {
			_id
			userPosted {
				username
			}
			title
			description
			date
			tags
			isReply
			parentPost {
				_id
				title
			}
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
			replies {
				_id
			}
		}
	}
`;

const GET_POST = gql`
	query GetPost($getPostId: String!) {
		getPost(id: $getPostId) {
			_id
			userPosted {
				username
			}
			title
			description
			date
			tags
			isReply
			parentPost {
				_id
				userPosted {
					username
				}
			}
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
			replies {
				_id
				title
			}
		}
	}
`;

const ADD_POST = gql`
	mutation AddPost($description: String!, $title: String!, $tags: [String]) {
		AddPost(description: $description, title: $title, tags: $tags) {
			_id
			userPosted {
				username
			}
			title
			description
			date
			tags
			isReply
			parentPost {
				_id
			}
		}
	}
`;

const USER_UPVOTES_A_POST = gql`
	mutation UserUpVotesAPost($postId: ID!) {
		UserUpVotesAPost(postID: $postId) {
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
		}
	}
`;

const USER_DOWNVOTES_A_POST = gql`
	mutation UserDownVotesAPost($postId: ID!) {
		UserDownVotesAPost(postID: $postId) {
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
		}
	}
`;

const USER_REMOVE_UPVOTE_FROM_POST = gql`
	mutation UserRemoveUpVoteFromAPost($postId: ID!) {
		UserRemoveUpVoteFromAPost(postID: $postId) {
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
		}
	}
`;

const USER_REMOVE_DOWNVOTE_FROM_POST = gql`
	mutation UserRemoveDownVoteFromAPost($postId: ID!) {
		UserRemoveDownVoteFromAPost(postID: $postId) {
			usersUpVoted {
				username
			}
			usersDownVoted {
				username
			}
		}
	}
`;

export {
	SIGN_IN,
	GET_USER_INFO,
	GET_POSTS,
	GET_POST,
	ADD_POST,
	USER_UPVOTES_A_POST,
	USER_DOWNVOTES_A_POST,
	USER_REMOVE_UPVOTE_FROM_POST,
	USER_REMOVE_DOWNVOTE_FROM_POST,
};
