import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import './App.css';
import { AppBar, Button, Stack, TextField, Toolbar } from '@mui/material';
import { useState } from 'react';

function App() {
	return (
		<div>
			<Router>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/login' element={<LoginPage />} />
					<Route path='/register' element={<RegisterPage />} />
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
	return (
		<Layout>
			<Typography component='h1' variant='h3'>
				Home page here
			</Typography>
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
