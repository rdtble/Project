import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import './App.css';
import 'react-mde/lib/styles/css/react-mde-all.css';
import {
	AppBar,
	Button,
	Card,
	Chip,
	Fab,
	Grid,
	Stack,
	TextField,
	Toolbar,
	Tooltip,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { GET_POSTS } from './queries';

function App() {
	return (
		<div>
			<Router>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />
					<Route path='/create-post' element={<CreatePostPage />} />
				</Routes>
			</Router>
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

	return (
		<AppBar component='nav'>
			<Toolbar sx={{ gap: 3 }}>
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
			</Toolbar>
		</AppBar>
	);
};

const HomePage = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};

	const { data, error, loading } = useQuery(GET_POSTS, {
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
				<Grid container direction='column' gap={4}>
					{getPosts.map((post) => (
						<Grid item key={post._id}>
							<Card sx={{ paddingY: 4, paddingX: 2 }}>
								<Stack direction='row' gap={3}>
									<Stack direction='column'>
										<Stack>
											<Tooltip
												title='Upvote'
												placement='left'>
												<ArrowUpwardIcon />
											</Tooltip>
										</Stack>
										<Stack>
											<Tooltip
												title='Downvote'
												placement='left'>
												<ArrowDownwardIcon />
											</Tooltip>
										</Stack>
									</Stack>

									<Stack>
										<Typography component='h2' variant='h4'>
											{post.title}
										</Typography>

										<Tooltip
											title={moment(
												Number(post.date)
											).format(
												'Do MMM, YYYY (hh:mm:ss a)'
											)}
											arrow>
											<Typography
												component='p'
												variant='overline'>
												{moment(
													Number(post.date)
												).fromNow()}
											</Typography>
										</Tooltip>

										<Typography
											component='p'
											variant='body1'>
											{post.description}
										</Typography>

										<Chip label={post.tags[0]} />
									</Stack>
								</Stack>
							</Card>
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

const CreatePostPage = () => {
	const [value, setValue] = useState('');
	const [selectedTab, setSelectedTab] = useState('write');

	return (
		<Layout>
			<ReactMde
				value={value}
				onChange={setValue}
				selectedTab={selectedTab}
				onTabChange={setSelectedTab}
				generateMarkdownPreview={(markdown) =>
					Promise.resolve(<ReactMarkdown children={markdown} />)
				}
				childProps={{
					writeButton: {
						tabIndex: -1,
					},
				}}
			/>
		</Layout>
	);
};

const LoginPage = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = (e) => {
		e.preventDefault();

		console.log(username, password);
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
					<Button type='submit'>login</Button>
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

					<Button type='submit'>login</Button>
				</Stack>
			</form>
		</Layout>
	);
};

export default App;
