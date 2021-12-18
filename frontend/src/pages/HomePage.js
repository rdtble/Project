import { useNavigate } from 'react-router';
import { useQuery } from '@apollo/client';

import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import EditIcon from '@mui/icons-material/Edit';

import Layout from '../layouts/Layout';
import { GET_POSTS } from '../queries';
import QueryCard from '../components/QueryCard';

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
		return (
			<Layout>
				<Box sx={{ display: 'flex' }}>
					<CircularProgress />
				</Box>
			</Layout>
		);
	}

	if (error) {
		return <Layout>{error.message}</Layout>;
	}

	if (data) {
		const { getPosts } = data;

		return (
			<Layout>
				<Typography component='h1' variant='h3'>
					Home
				</Typography>
				<Grid container direction='column'>
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

export default HomePage;
