// import { appBarClasses } from '@mui/material';
import { useState } from 'react';
// import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';

function ChatPage() {
    const [loading, setLoading] = useState(true);
    let loggedInAs = <h3> </h3>

    const [insideChatRoom, setInsideChatRoom] = useState(false);
    let joinButtonDisplay = null;
    let leaveButtonDisplay = null;
    let chatRoomHeader = null;

    try {
        VoxeetSDK.initialize("KPtPBC3RfX0l85Qm9RkIZw==", "AMaODzmyjiEot7BlbVxcQ44s0KkM8tt3tt4edofmZqg=");
    }
    catch (e) {
        console.log(e);
    }

    let currentuser = "USERNAME!"

    const sessionopen = async () => {
        try {
            // Open the session here !!!!
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            await VoxeetSDK.session.open({ name: currentuser });

            setLoading(false);

            loggedInAs = <h3> You are logged in as {currentuser} </h3>
            joinButtonDisplay = <button id="join-btn-chat" onClick={joinChat} >Join</button>;
            leaveButtonDisplay = <button id="leave-btn-chat" onClick={leaveChat} >Leave</button>;
        } catch (e) {
            console.log('ERROR : ' + e)
        }
    }

    sessionopen();

    const joinChat = () => {

        let conferenceAlias = "Pradeep";
        console.log("CON CREATED");
        VoxeetSDK.conference.create({ alias: conferenceAlias })
            .then((conference) => VoxeetSDK.conference.join(conference, {}))
            .then(() => {
                joinButtonDisplay = <button id="join-btn-chat" onClick={joinChat} disabled>Join</button>
                leaveButtonDisplay = <button id="leave-btn-chat" onClick={leaveChat}>Leave</button>
            })
            .catch((err) => console.error(err));
        setInsideChatRoom(true);
    }


    const leaveChat = () => {

        VoxeetSDK.conference
            .leave()
            .then(() => {
                joinButtonDisplay = <button id="join-btn-chat" onClick={joinChat} >Join Chat Room</button>
                leaveButtonDisplay = <button id="leave-btn-chat" onClick={leaveChat} hidden>Leave Chat Room</button>
            })
            .catch((err) => console.error(err));
        setInsideChatRoom(false);
    }

    if (insideChatRoom) {
        joinButtonDisplay = <button id="join-btn-chat" onClick={joinChat} hidden>Join Chat Room</button>;
        leaveButtonDisplay = <button id="leave-btn-chat" onClick={leaveChat} >Leave Chat Room</button>;
        chatRoomHeader = <div><h1 id="name-message">You are inside the chat room. We're listening!!! </h1>
        </div>
    }
    else {
        joinButtonDisplay = <button id="join-btn-chat" onClick={joinChat} >Join Chat Room</button>;
        leaveButtonDisplay = <button id="leave-btn-chat" onClick={leaveChat} hidden>Leave Chat Room</button>;
        chatRoomHeader = <div>
            <h1 id="name-message"> Express your thoughts by joining the global audio chatroom.  </h1>
        </div>
    }


    // useEffect(() => {
    // 	VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
    // 		if (stream.type === 'ScreenShare') return;

    // 		if (stream.getVideoTracks().length) {
    // 			addVideoNode(participant, stream);
    // 		}
    // 		addParticipantNode(participant);

    // 	});
    // }, []);

    // --------------------------------------------------------------------- SOCKET IO ------------------------------------------------------------------------------------------------

    // const [messageState, setState] = useState({ message: '', name: '' });
    // const [chat, setChat] = useState([]);
    // const socketRef = useRef();

    // useEffect(() => {
    // 	socketRef.current = io('/chat');
    // 	return () => {
    // 		socketRef.current.disconnect();
    // 	};
    // }, []);

    // useEffect(() => {
    // 	socketRef.current.on('message', ({ name, message }) => {
    // 		setChat([...chat, { name, message }]);
    // 	});
    // 	socketRef.current.on('user_join', function (data) {
    // 		setChat([
    // 			...chat,
    // 			{ name: 'ChatBot', message: `${data} has joined the chat` },
    // 		]);
    // 	});
    // }, [chat]);

    // const userjoin = (name) => {
    // 	socketRef.current.emit('user_join', name);
    // };

    // const onMessageSubmit = (e) => {
    // 	let msgEle = document.getElementById('message');
    // 	console.log([msgEle.name], msgEle.value);
    // 	setState({ ...messageState, [msgEle.name]: msgEle.value });
    // 	socketRef.current.emit('message', {
    // 		name: messageState.name,
    // 		message: msgEle.value,
    // 	});
    // 	e.preventDefault();
    // 	setState({ message: '', name: messageState.name });
    // 	msgEle.value = '';
    // 	msgEle.focus();
    // };

    // const renderChat = () => {
    // 	return chat.map(({ name, message }, index) => (
    // 		<div key={index}>
    // 			<h3>
    // 				{name}: <span>{message}</span>
    // 			</h3>
    // 		</div>
    // 	));
    // };

    // return (
    // 	<div>
    // 		<Navbar />
    {/* <br />
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
			// )} */}
    // )
    // --------------------------------------------------------------------- SOCKET IO ------------------------------------------------------------------------------------------------

    if (loading) {
        return (
            <div> Loading.... </div>
        )
    }
    else {
        return (
            <div>
                <Navbar />
                <br />
                <br />
                <br />
                {chatRoomHeader}
                <div id="app">

                    <div className='chatForm'>
                        {joinButtonDisplay}
                        {leaveButtonDisplay}
                    </div>
                    {/* <div id="actions">
					<button id="start-video-btn" disabled>Start video</button>
					<button id="stop-video-btn" disabled>Stop video</button>
				</div> */}
                    {/* <div id="participants">
					<h3>Participants</h3>
					<ul id="participants-list"></ul>
				</div> */}
                </div>

                <script src="https://unpkg.com/@voxeet/voxeet-web-sdk@0.3.10/dist/voxeet-sdk.js" type="text/javascript"></script>
                <script src="https://unpkg.com/@voxeet/voxeet-web-sdk" type="text/javascript"></script>

            </div>
        );
    }
};

export default ChatPage;
