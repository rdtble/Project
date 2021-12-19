import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from '@apollo/client';

import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import AuthContext from '../context/context';
import Layout from '../layouts/Layout';
import { GET_POSTS } from '../queries';
import QueryCard from '../components/QueryCard';

const HomePage = () => {
	const navigate = useNavigate();
	const handleNavigation = (path) => {
		navigate(path);
	};

	const [hasMoreResults, setHasMoreResults] = useState(true);

	const { state } = useContext(AuthContext);

	const { data, error, loading, fetchMore } = useQuery(GET_POSTS, {
		variables: { pageNum: 1, pageSize: 2, sortBy: 'default' },
		fetchPolicy: 'network-only',
	});

	const handleFetchMore = (getPosts) =>
		fetchMore({
			variables: {
				pageNum: getPosts.length / 2 + 1,
				pageSize: 2,
				sortBy: 'default',
			},
			updateQuery: (prevResult, { fetchMoreResult }) => {
				if (!fetchMoreResult) {
					return prevResult;
				}

				if (fetchMoreResult.getPosts.length < 2) {
					setHasMoreResults(false);
				}

				return {
					...prevResult,
					getPosts: [
						...prevResult.getPosts,
						...fetchMoreResult.getPosts,
					],
				};
			},
		});

	if (loading) {
		return (
			<Layout>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100vh',
						width: '100vw',
					}}>
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
				<Typography component='h1' variant='h3' gutterBottom>
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

					{hasMoreResults && (
						<Button
							onClick={() => handleFetchMore(getPosts)}
							startIcon={<KeyboardArrowDownIcon />}
							sx={{ marginTop: 2 }}>
							load more
						</Button>
					)}
				</Grid>

				{state.isAuthenticated && (
					<Fab
						variant='extended'
						sx={{ position: 'fixed', bottom: 16, right: 16 }}
						onClick={() => handleNavigation('/create-post')}>
						<EditIcon sx={{ mr: 1 }} />
						Create Post
					</Fab>
				)}
			</Layout>
		);
	}
};

export default HomePage;
