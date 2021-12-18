import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import AuthContext from '../context/context';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import Logout from '@mui/icons-material/Logout';

const Navbar = () => {
	const navigate = useNavigate();

	const handleNavigation = (path) => {
		navigate(path);
	};

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = () => {
		window.localStorage.removeItem('token');
		window.location.reload();
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
						onClick={() => handleNavigation('/chat')}>
						Global Chat
					</Button>
				</Stack>

				<IconButton onClick={handleClick} size='small'>
					<PersonIcon />
				</IconButton>
			</Toolbar>

			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				transformOrigin={{ horizontal: 'right', vertical: 'top' }}
				anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
				{!state.isAuthenticated && (
					<MenuItem onClick={() => handleNavigation('/login')}>
						<ListItemIcon>
							<AccountCircleIcon fontSize='small' />
						</ListItemIcon>
						Login
					</MenuItem>
				)}

				{!state.isAuthenticated && (
					<MenuItem onClick={() => handleNavigation('/register')}>
						<ListItemIcon>
							<AccountCircleIcon fontSize='small' />
						</ListItemIcon>
						Register
					</MenuItem>
				)}

				{state.isAuthenticated && (
					<MenuItem
						onClick={() =>
							handleNavigation(`/user/${state.user.username}`)
						}>
						<ListItemIcon>
							<AccountCircleIcon fontSize='small' />
						</ListItemIcon>
						Account
					</MenuItem>
				)}
				{state.isAuthenticated && (
					<MenuItem onClick={handleLogout}>
						<ListItemIcon>
							<Logout fontSize='small' />
						</ListItemIcon>
						Logout
					</MenuItem>
				)}
			</Menu>
		</AppBar>
	);
};

export default Navbar;
