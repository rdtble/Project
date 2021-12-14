import { gql } from '@apollo/client';

const GET_POSTS = gql`
	query GetPosts($pageNum: Int, $pageSize: Int) {
		getPosts(pageNum: $pageNum, pageSize: $pageSize) {
			_id
			title
			description
			date
			tags
			isReply
		}
	}
`;

const ADD_POST = gql`
	mutation AddPost(
		$userId: ID!
		$desciption: String!
		$title: String!
		$tags: [String]
	) {
		AddPost(
			userID: $userId
			desciption: $desciption
			title: $title
			tags: $tags
		) {
			_id
			title
			description
			date
			tags
			usersUpvoted
			usersDownvoted
			isReply
			replies
			parentPost
		}
	}
`;

export { GET_POSTS, ADD_POST };
