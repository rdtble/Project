import { gql } from '@apollo/client';

const GET_POSTS = gql`
	query Query {
		getPosts {
			_id
			userPosted
			title
			description
			date
			tags
			usersUpvoted
			usersDownvoted
			isReply
			replies
		}
	}
`;

export { GET_POSTS };
