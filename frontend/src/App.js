import { useContext, useEffect, useReducer } from 'react';
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Link as RouterLink,
} from 'react-router-dom';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import './App.css';
import 'react-mde/lib/styles/css/react-mde-all.css';
import {
	AppBar,
	Avatar,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Fab,
	Grid,
	IconButton,
	Link,
	Stack,
	TextField,
	Toolbar,
	Tooltip,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { useState } from 'react';
import io from 'socket.io-client';
import React, { useRef} from 'react';
import {
	ADD_POST,
	GET_POST,
	GET_POSTS,
	GET_USER_INFO,
	SIGN_IN,
	USER_DOWNVOTES_A_POST,
	USER_REMOVE_DOWNVOTE_FROM_POST,
	USER_REMOVE_UPVOTE_FROM_POST,
	USER_UPVOTES_A_POST,
} from './queries';
import authReducer, { initialState } from './context/reducer';
import AuthContext from './context/context';
import { USER_LOADED, UNAUTH_USER_LOADED, LOGIN } from './types';

// TODO: Add toasts to show status/errors
function App() {
	const [getUser, { data, loading, error }] = useLazyQuery(GET_USER_INFO, {
		context: { headers: { authorization: localStorage.getItem('token') } },
	});
	const [state, dispatch] = useReducer(authReducer, initialState);
	const value = { state, dispatch };
	const [messageState, setState] = useState({ message: '', name: '' });
	const [chat, setChat] = useState([]);
	const socketRef = useRef();

	// useEffect(() => {
	// 	socketRef.current = io('/');
	// 	return () => {
	// 		socketRef.current.disconnect();
	// 	};
	// }, []);

	useEffect(() => {
		socketRef.current.on('message', ({ name, message }) => {
			setChat([...chat, { name, message }]);
		});
		socketRef.current.on('user_join', function (data) {
			setChat([
				...chat,
				{ name: 'ChatBot', message: `${data} has joined the chat` }
			]);
		});
	}, [chat]);

	const userjoin = (name) => {
		socketRef.current.emit('user_join', name);
	};

	const onMessageSubmit = (e) => {
		let msgEle = document.getElementById('message');
		console.log([msgEle.name], msgEle.value);
		setState({ ...messageState, [msgEle.name]: msgEle.value });
		socketRef.current.emit('message', {
			name: messageState.name,
			message: msgEle.value
		});
		e.preventDefault();
		setState({ message: '', name: messageState.name });
		msgEle.value = '';
		msgEle.focus();
	};

	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div key={index}>
				<h3>
					{name}: <span>{message}</span>
				</h3>
			</div>
		));
	};

	useEffect(() => {
		getUser().then((res) => console.log(res.data, 'use effect load'));

		if (data) {
			const user = data.getUserInfo;

			dispatch({ type: USER_LOADED, payload: { user } });
		} else {
			dispatch({ type: UNAUTH_USER_LOADED, payload: {} });
		}
	}, [data]);

	if (state.isLoading && !state.isAuthenticated) return <div>Loading...</div>;

	return (
		<div>
			<AuthContext.Provider value={value}>
				<Router>
					<Routes>
						<Route path='/' element={<HomePage />} />
						<Route path='/login' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />
						<Route
							path='/create-post'
							element={<CreatePostPage />}
						/>
						<Route path='/post/:id' element={<PostPage />} />
					</Routes>
				</Router>
			</AuthContext.Provider>
		</div>
	);
}

const Layout = ({ children }) => {
	return (
		<>
			<Navbar />
			<Container component='main' sx={{ paddingY: 10 }}>
				{children}
			</Container>
		</>
	);
};

const Navbar = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};

	const { state } = useContext(AuthContext);

	return (
		<AppBar component='nav'>
			<Toolbar
				sx={{
					alignContent: 'center',
					justifyContent: 'space-between',
				}}>
				<Stack direction='row' gap={3}>
					<Button
						variant='text'
						color='inherit'
						onClick={() => handleNavigation('/')}>
						home
					</Button>

					<Button
						variant='text'
						color='inherit'
						onClick={() => handleNavigation('/login')}>
						login
					</Button>

					<Button
						variant='text'
						color='inherit'
						onClick={() => handleNavigation('/register')}>
						register
					</Button>
				</Stack>
				{state.user && <Stack>{state.user.username}</Stack>}
			</Toolbar>
		</AppBar>
	);
};

// TODO: handle pagination / load more button
const HomePage = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};

	const { data, error, loading } = useQuery(GET_POSTS, {
		variables: { pageNum: 2, pageSize: 10, sortBy: 'default' },
		fetchPolicy: 'network-only',
	});

	if (loading) {
		return <Layout>Loading...</Layout>;
	}

	if (error) {
		return <Layout>{error.message}</Layout>;
	}

	if (data) {
		const { getPosts } = data;

		return (
			<Layout>
				<div>
					{messageState.name && (
						<div className="card">
							<div className="render-chat">
								<h1>Chat Log</h1>
								{renderChat()}
							</div>
							<form onSubmit={onMessageSubmit}>
								<h1>Messenger</h1>
								<div>
									<input
										name="message"
										id="message"
										variant="outlined"
										label="Message"
									/>
								</div>
								<button>Send Message</button>
							</form>
						</div>
					)}

					{!messageState.name && (
						<form
							className="form"
							onSubmit={(e) => {
								console.log(document.getElementById('username_input').value);
								e.preventDefault();
								setState({ name: document.getElementById('username_input').value });
								userjoin(document.getElementById('username_input').value);
								// userName.value = '';
							}}
						>
							<div className="form-group">
								<label>
									UserName:
									<br />
									<input id="username_input" />
								</label>
							</div>
							<br />

							<br />
							<br />
							<button type="submit"> Click to join chat room</button>
						</form>
					)}
				</div>
				<Grid container direction='column' gap={4}>
					{getPosts.length === 0 && (
						<Typography component='h2' variant='h5'>
							No posts to show!
						</Typography>
					)}
					{getPosts.map((post) => (
						<Grid item key={post._id} xs>
							<QueryCard post={post} mode='list' />
						</Grid>
					))}
				</Grid>

				<Fab
					variant='extended'
					sx={{ position: 'fixed', bottom: 16, right: 16 }}
					onClick={() => handleNavigation('/create-post')}>
					<EditIcon sx={{ mr: 1 }} />
					Create Post
				</Fab>
			</Layout>
		);
	}
};

// FIXME: Handle upvote/downvote and reply button for non-authenticated users
// TODO: Add functionality to reply buttons
// TODO: Add toasts for interactions
const QueryCard = ({ post, mode }) => {
	const { state } = useContext(AuthContext);
	const [postData, setPostData] = useState(post);

	const numReplies = postData.replies.length;
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

	return (
		<Card>
			<CardContent>
				<Stack direction='row' gap={3}>
					<Stack direction='column' alignItems='center'>
						<Stack>
							<Tooltip title='Upvote' placement='left'>
								<IconButton
									color={
										upvoted.length === 0
											? 'inherit'
											: 'primary'
									}
									onClick={() => handleUpvotePost()}>
									<ArrowUpwardIcon />
								</IconButton>
							</Tooltip>
						</Stack>
						<Typography component='p'>
							<b>{numUpvotes - numDownvotes}</b>
						</Typography>
						<Stack>
							<Tooltip title='Downvote' placement='left'>
								<IconButton
									color={
										downvoted.length === 0
											? 'inherit'
											: 'primary'
									}
									onClick={() => handleDownvotePost()}>
									<ArrowDownwardIcon />
								</IconButton>
							</Tooltip>
						</Stack>
					</Stack>

					<Stack>
						<Stack direction='row' alignItems='center' gap={2}>
							{/* <Avatar>
												{post.userPosted.username[0]}
											</Avatar> */}
							<Typography component='h3'>
								{postData.userPosted.username}
							</Typography>
						</Stack>

						<Typography component='h2' variant='h4'>
							{mode === 'list' ? (
								<RouterLink
									to={`/post/${post._id}`}
									style={{ textDecoration: 'none' }}>
									<Link underline='none'>
										{postData.title}
									</Link>
								</RouterLink>
							) : (
								<>{postData.title}</>
							)}
						</Typography>

						<Tooltip
							title={moment(postData.date).format(
								'Do MMM, YYYY (hh:mm:ss a)'
							)}
							arrow>
							<Typography component='p' variant='overline'>
								{moment(postData.date).fromNow()}
							</Typography>
						</Tooltip>

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

						<CardActions
							sx={{
								paddingX: 0,
								paddingY: 2,
							}}>
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
								onClick={() => {
									console.log('reply');
								}}>
								Comment ({numReplies})
							</Button>

							{state.user &&
								state.user.username ===
								post.userPosted.username && (
									<Button
										size='small'
										variant='text'
										startIcon={<DeleteIcon />}
										onClick={() => {
											console.log('delete');
										}}>
										Delete
									</Button>
								)}
						</CardActions>

						{mode !== 'list' && (
							<Stack>
								<Typography component='h3' variant='h6'>
									<strong>
										Replies ({postData.replies.length})
									</strong>
								</Typography>

								{postData.replies.length !== 0 ? (
									<Grid container direction='column' gap={4}>
										{postData.replies.map((post) => (
											<Grid item key={post._id} xs>
												<QueryCard
													post={post}
													mode='list'
												/>
											</Grid>
										))}
									</Grid>
								) : (
									<Typography component='p' variant='body2'>
										No replies yet!
									</Typography>
								)}
							</Stack>
						)}
					</Stack>
				</Stack>
			</CardContent>
		</Card>
	);
};

const CreatePostPage = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};
	const [title, setTitle] = useState('');
	const [value, setValue] = useState('');
	const [tags, setTags] = useState([]);
	const [tagText, setTagText] = useState('');
	const [selectedTab, setSelectedTab] = useState('write');

	const [addPost, { loading, error }] = useMutation(ADD_POST, {
		variables: {
			description: value,
			title: title,
			tags: tags,
		},
	});

	const handleAddTag = () => {
		if (tagText.trim() === '') {
			alert('Tag cannot be empty!');
		} else {
			setTags([...tags, tagText]);

			setTagText('');
		}
	};

	const handleTagDelete = (tag) => {
		const tagsCopy = tags.filter((item) => item !== tag);

		setTags([...tagsCopy]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (value.trim() === '') {
			alert('Description cannot be empty!');
		} else {
			await addPost().then(({ data }) =>
				handleNavigation(`/post/${data.AddPost._id}`)
			);
		}
	};

	return (
		<Layout>
			<form onSubmit={handleSubmit}>
				<Stack direction='column' spacing={3} paddingY={4}>
					<TextField
						id='title'
						name='title'
						type='text'
						required
						placeholder='post title'
						label='post title'
						fullWidth
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>

					<ReactMde
						value={value}
						onChange={setValue}
						selectedTab={selectedTab}
						onTabChange={setSelectedTab}
						generateMarkdownPreview={(markdown) =>
							Promise.resolve(
								<ReactMarkdown children={markdown} />
							)
						}
						childProps={{
							writeButton: {
								tabIndex: -1,
							},
						}}
					/>

					<Grid container gap={1}>
						{tags.length !== 0 &&
							tags.map((tag) => (
								<Grid key={tag} item>
									<Chip
										label={tag}
										onDelete={() => handleTagDelete(tag)}
									/>
								</Grid>
							))}
					</Grid>

					<Stack direction='row' spacing={4} marginY={3}>
						<TextField
							id='tag'
							name='tag'
							type='text'
							size='small'
							placeholder='add a tag'
							label='add a tag'
							value={tagText}
							onChange={(e) => setTagText(e.target.value)}
						/>

						<Button
							variant='outlined'
							color='primary'
							onClick={() => handleAddTag()}>
							<AddIcon />
						</Button>
					</Stack>

					<Button
						disabled={loading}
						type='submit'
						variant='contained'
						sx={{ marginTop: 3 }}>
						Create Post
					</Button>
				</Stack>
			</form>
		</Layout>
	);
};

const PostPage = () => {
	const { id } = useParams();

	const { data, loading, error } = useQuery(GET_POST, {
		variables: { getPostId: id },
	});

	if (loading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>{error.message}</div>;
	}

	if (data) {
		const postData = data.getPost;

		return (
			<Layout>
				<QueryCard post={postData} mode='single' />
			</Layout>
		);
	}
};

const LoginPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);

	const { dispatch } = useContext(AuthContext);

	const [signIn, response] = useMutation(SIGN_IN, {
		variables: { username, password },
	});
	const [getUser, { data, error }] = useLazyQuery(GET_USER_INFO, {
		context: { headers: { authorization: localStorage.getItem('token') } },
	});

	const handleLogin = (e) => {
		e.preventDefault();
		setLoading(true);

		signIn()
			.then(({ data }) => {
				console.log(data);
				const token = data.signIn;

				getUser().then((res) => {
					const user = data.getUserInfo;
					const payload = { token, user };

					dispatch({ type: LOGIN, payload });
				});
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	};

	return (
		<Layout>
			<Typography component='h1' variant='h3'>
				Login here
			</Typography>

			<form onSubmit={handleLogin}>
				<Stack direction='column' gap={4}>
					<TextField
						id='username'
						name='username'
						type='text'
						required
						placeholder='username'
						label='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						id='password'
						name='password'
						type='password'
						required
						placeholder='password'
						label='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button disabled={loading} type='submit'>
						login
					</Button>
				</Stack>
			</form>
		</Layout>
	);
};

const RegisterPage = () => {
	const [firstname, setFirstname] = useState('');
	const [lastname, setLastname] = useState('');
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [password2, setPassword2] = useState('');

	const handleRegister = (e) => {
		e.preventDefault();

		console.log(username, password);
	};

	return (
		<Layout>
			<Typography component='h1' variant='h3'>
				Register here
			</Typography>

			<form onSubmit={handleRegister}>
				<Stack direction='column' gap={4}>
					<TextField
						id='firstname'
						name='firstname'
						type='text'
						required
						placeholder='first name'
						label='first name'
						value={firstname}
						onChange={(e) => setFirstname(e.target.value)}
					/>

					<TextField
						id='lastname'
						name='lastname'
						type='text'
						required
						placeholder='last name'
						label='last name'
						value={lastname}
						onChange={(e) => setLastname(e.target.value)}
					/>

					<TextField
						id='email'
						name='email'
						type='email'
						required
						placeholder='email'
						label='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<TextField
						id='username'
						name='username'
						type='text'
						required
						placeholder='username'
						label='username'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
					/>

					<TextField
						id='password'
						name='password'
						type='password'
						required
						placeholder='password'
						label='password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<TextField
						id='password2'
						name='password2'
						type='password'
						required
						placeholder='confirm password'
						label='confirm password'
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
					/>

					<Button type='submit'>register</Button>
				</Stack>
			</form>
		</Layout>
	);
};

export default App;
