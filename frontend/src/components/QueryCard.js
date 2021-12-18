import { useContext, useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router';

import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import CloseIcon from '@mui/icons-material/Close';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import AuthContext from '../context/context';
import {
	DELETE_POST,
	USER_DOWNVOTES_A_POST,
	USER_REMOVE_DOWNVOTE_FROM_POST,
	USER_REMOVE_UPVOTE_FROM_POST,
	USER_UPVOTES_A_POST,
} from '../queries';
import WriteReply from './WriteReply';

// FIXME: Handle upvote/downvote and reply button for non-authenticated users
// TODO: Add functionality to reply buttons
// TODO: Add toasts for interactions
const QueryCard = ({ post, mode, location }) => {
	const { state } = useContext(AuthContext);
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};

	const [postData, setPostData] = useState(post);
	const [replyOpen, setReplyOpen] = useState(false);

	const numUpvotes = postData.usersUpVoted.length;
	const numDownvotes = postData.usersDownVoted.length;

	const upvoted = state.user
		? postData.usersUpVoted.filter(
				(user) => user.username === state.user.username
		  )
		: [];
	const downvoted = state.user
		? postData.usersDownVoted.filter(
				(user) => user.username === state.user.username
		  )
		: [];

	const [upvotePost] = useMutation(USER_UPVOTES_A_POST, {
		variables: { postId: post._id },
	});

	const [downvotePost] = useMutation(USER_DOWNVOTES_A_POST, {
		variables: { postId: post._id },
	});

	const [removeUpvotePost] = useMutation(USER_REMOVE_UPVOTE_FROM_POST, {
		variables: { postId: post._id },
	});

	const [removeDownvotePost] = useMutation(USER_REMOVE_DOWNVOTE_FROM_POST, {
		variables: { postId: post._id },
	});

	const [deletePost] = useMutation(DELETE_POST, {
		variables: { postId: post._id },
	});

	const handleUpvotePost = () => {
		if (upvoted.length !== 0) {
			removeUpvotePost().then((res) => {
				const { UserRemoveUpVoteFromAPost } = res.data;
				setPostData({
					...postData,
					...UserRemoveUpVoteFromAPost,
				});
			});
		} else {
			upvotePost().then((res) => {
				const { UserUpVotesAPost } = res.data;
				setPostData({ ...postData, ...UserUpVotesAPost });
			});
		}
	};

	const handleDownvotePost = () => {
		if (downvoted.length !== 0) {
			removeDownvotePost().then((res) => {
				const { UserRemoveDownVoteFromAPost } = res.data;
				setPostData({
					...postData,
					...UserRemoveDownVoteFromAPost,
				});
			});
		} else {
			downvotePost().then((res) => {
				const { UserDownVotesAPost } = res.data;
				setPostData({ ...postData, ...UserDownVotesAPost });
			});
		}
	};

	const handleReply = (AddComment) => {
		setPostData({ ...postData, ...AddComment });
	};

	const handleReplyOpen = () => {
		setReplyOpen(true);
	};

	const handleReplyClose = () => {
		setReplyOpen(false);
	};

	const handleDelete = () => {
		deletePost()
			.then(({ data }) => {
				const { DeletePost } = data;

				if (DeletePost) {
					setPostData({
						...postData,
						description: '_**[deleted]**_',
					});
				}
			})
			.catch((err) => alert('Cannot delete this post'));
	};

	return (
		<Card variant='outlined' sx={{ borderRadius: 0 }}>
			{postData.isReply && mode === 'single' && (
				<Stack paddingX={4} paddingY={2}>
					<Button
						color='secondary'
						size='small'
						startIcon={<ArrowDropUpIcon />}
						onClick={() =>
							handleNavigation(`/post/${postData.parentPost._id}`)
						}>
						Load parent post
					</Button>
				</Stack>
			)}

			<CardContent>
				<Stack direction='row' gap={3}>
					<Stack direction='column' alignItems='center'>
						<Stack>
							<Tooltip title='Upvote' placement='left'>
								<span>
									<IconButton
										disabled={postData.isDeleted}
										color={
											upvoted.length === 0
												? 'inherit'
												: 'primary'
										}
										onClick={() => handleUpvotePost()}>
										<ArrowUpwardIcon />
									</IconButton>
								</span>
							</Tooltip>
						</Stack>
						<Typography component='p'>
							<b>{numUpvotes - numDownvotes}</b>
						</Typography>
						<Stack>
							<Tooltip title='Downvote' placement='left'>
								<span>
									<IconButton
										disabled={postData.isDeleted}
										color={
											downvoted.length === 0
												? 'inherit'
												: 'primary'
										}
										onClick={() => handleDownvotePost()}>
										<ArrowDownwardIcon />
									</IconButton>
								</span>
							</Tooltip>
						</Stack>
					</Stack>

					<Stack flex={1}>
						<Typography component='h2' variant='h4'>
							{mode === 'list' ? (
								<Link
									underline='none'
									sx={{
										':hover': {
											cursor: 'pointer',
										},
									}}
									onClick={() =>
										handleNavigation(`/post/${post._id}`)
									}>
									{postData.title}
								</Link>
							) : (
								<>{postData.title}</>
							)}
						</Typography>

						<ReactMarkdown children={postData.description} />

						{postData.tags && (
							<Grid container gap={1}>
								{postData.tags.map((tag) => (
									<Grid key={tag} item>
										<Chip label={tag} />
									</Grid>
								))}
							</Grid>
						)}

						{!postData.isDeleted && (
							<CardActions
								sx={{
									paddingX: 0,
									paddingY: 2,
									justifyContent: 'space-between',
									alignItems: 'flex-end',
									maxWidth: '100%',
								}}>
								<Stack direction='row' gap={1}>
									<Button
										size='small'
										variant='text'
										startIcon={<ShareIcon />}
										onClick={() => {
											navigator.clipboard.writeText(
												window.location.origin.concat(
													`/post/${post._id}`
												)
											);
										}}>
										Share
									</Button>

									<Button
										size='small'
										variant='text'
										startIcon={<ReplyIcon />}
										onClick={handleReplyOpen}>
										Comment{' '}
										{mode === 'single' &&
											`(${postData.replies.length})`}
									</Button>

									{state.user &&
										state.user.username ===
											post.userPosted.username && (
											<Button
												size='small'
												variant='text'
												startIcon={<DeleteIcon />}
												onClick={handleDelete}>
												Delete
											</Button>
										)}
								</Stack>

								<Card
									variant='outlined'
									sx={{
										padding: 1,
										backgroundColor: 'lightgray',
									}}>
									<Typography component='p' variant='caption'>
										<Link
											underline='none'
											sx={{
												':hover': {
													cursor: 'pointer',
												},
											}}
											onClick={() =>
												handleNavigation(
													`/user/${post.userPosted.username}`
												)
											}>
											{postData.userPosted.username}
										</Link>
									</Typography>
									<Tooltip
										title={moment(postData.date).format(
											'Do MMM, YYYY (hh:mm:ss a)'
										)}
										arrow>
										<Typography
											component='p'
											variant='caption'>
											{moment(postData.date).fromNow()}
										</Typography>
									</Tooltip>
								</Card>
							</CardActions>
						)}

						{/* <Typography component='h3' variant='h6'>
									<strong>
										Replies ({postData.replies.length})
									</strong>
								</Typography> */}

						{mode !== 'list' && postData.replies && (
							<Grid container direction='column' marginTop={2}>
								{postData.replies.map((post) => (
									<Grid item key={post._id} xs>
										<QueryCard post={post} mode='comment' />
									</Grid>
								))}
							</Grid>
						)}

						{!postData.replies && post.isReply && (
							<Stack>
								<Button
									color='secondary'
									size='small'
									startIcon={<ClearAllIcon />}
									onClick={() =>
										handleNavigation(
											`/post/${postData._id}`
										)
									}>
									Continue this thread
								</Button>
							</Stack>
						)}

						<Dialog
							fullWidth
							maxWidth='lg'
							open={replyOpen}
							onClose={handleReplyClose}>
							<DialogTitle
								sx={{
									display: 'flex',
									justifyContent: 'space-between',
								}}>
								Write a reply
								<IconButton onClick={handleReplyClose}>
									<CloseIcon />
								</IconButton>
							</DialogTitle>
							<DialogContent>
								<WriteReply
									parentPostId={postData._id}
									closeFunction={handleReplyClose}
									handleReply={handleReply}
								/>
							</DialogContent>
						</Dialog>
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default QueryCard;
