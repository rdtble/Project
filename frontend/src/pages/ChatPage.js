import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import Navbar from '../components/Navbar';

const ChatPage = () => {
	const [messageState, setState] = useState({ message: '', name: '' });
	const [chat, setChat] = useState([]);

	const socketRef = useRef();

	useEffect(() => {
		socketRef.current = io('/chat');
		return () => {
			socketRef.current.disconnect();
		};
	}, []);

	useEffect(() => {
		socketRef.current.on('message', ({ name, message }) => {
			setChat([...chat, { name, message }]);
		});
		socketRef.current.on('user_join', function (data) {
			setChat([
				...chat,
				{ name: 'ChatBot', message: `${data} has joined the chat` },
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
			message: msgEle.value,
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

	return (
		<div>
			<Navbar />
			<br />
			<br />
			<br /> <br />
			{messageState.name && (
				<div className='card'>
					<form onSubmit={onMessageSubmit}>
						<h1>Messenger</h1>
						<div>
							<input
								name='message'
								id='message'
								variant='outlined'
								label='Message'
							/>
						</div>
						<button className='chatButton'>Send Message</button>
					</form>

					<div className='render-chat'>
						<h1>Global Chatroom</h1>
						{renderChat()}
					</div>
				</div>
			)}
			{!messageState.name && (
				<form
					className='form'
					onSubmit={(e) => {
						console.log(
							document.getElementById('username_input').value
						);
						e.preventDefault();
						setState({
							name: document.getElementById('username_input')
								.value,
						});
						userjoin(
							document.getElementById('username_input').value
						);
						// userName.value = '';
					}}>
					<div className='form-group'>
						<label>
							UserName:
							<br />
							<input id='username_input' />
						</label>
					</div>
					<br />

					<br />
					<br />
					<button type='submit'> Click to join chat room</button>
				</form>
			)}
		</div>
	);
};

export default ChatPage;
