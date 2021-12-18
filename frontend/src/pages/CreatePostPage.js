import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import ReactMde from 'react-mde';
import ReactMarkdown from 'react-markdown';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AddIcon from '@mui/icons-material/Add';

import { ADD_POST } from '../queries';
import Layout from '../layouts/Layout';

// TODO: Handle for failure of adding post
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

export default CreatePostPage;
