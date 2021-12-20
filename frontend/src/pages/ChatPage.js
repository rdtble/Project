// import { appBarClasses } from '@mui/material';
import { useState, useEffect } from 'react';
// import io from 'socket.io-client';
import Navbar from '../components/Navbar';
import VoxeetSDK from '@voxeet/voxeet-web-sdk';
import { useLazyQuery } from '@apollo/client';
import { GET_USER_INFO } from '../queries';

function ChatPage() {
    const [loading, setLoading] = useState(true);
    const [currentUserName, setcurrentUserName] = useState("");
    let loggedInAs = <h3> </h3>
    const [sessionStarted, setSessionStarted] = useState(false);
    const [insideChatRoom, setInsideChatRoom] = useState(false);
    let joinButtonDisplay = null;
    let leaveButtonDisplay = null;
    let chatRoomHeader = null;
    let participantsList = <ul></ul>;
    // let currentuser = "USERNAME!"


    // const [getUser, { data }] = useLazyQuery(GET_USER_INFO, {
    //     context: { headers: { authorization: localStorage.getItem('token') } },
    // });



    // getUser();

    // if (data) {
    //     const user = data.getUserInfo;

    //     setcurrentUserName(user.firstname);

    //     // dispatch({ type: USER_LOADED, payload: { user } });
    // }


    try {
        VoxeetSDK.initialize("KPtPBC3RfX0l85Qm9RkIZw==", "AMaODzmyjiEot7BlbVxcQ44s0KkM8tt3tt4edofmZqg=");
    }
    catch (e) {
        console.log(e);
    }


    if (!sessionStarted) {


        const sessionopen = async () => {
            try {
                // Open the session here !!!!
                // try {
                //     await VoxeetSDK.session.close({ name: currentuser });
                // } catch (e) {
                //     console.log("Closing - ", e);
                // }
                console.log(sessionStarted);

                setLoading(false);
                setSessionStarted(true);
                await VoxeetSDK.session.open({ name: currentUserName });
                // loggedInAs = <h3> You are logged in as {currentuser} </h3>
                // joinButtonDisplay = <button id="join-btn-chat" onClick={joinChat} >Join</button>;
                // leaveButtonDisplay = <button id="leave-btn-chat" onClick={leaveChat} >Leave</button>;
            } catch (e) {
                console.log('ERROR : ' + e)
            }
        }
        sessionopen();
    }

    const joinChat = async () => {

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
    //     VoxeetSDK.conference.on('streamAdded', (participant, stream) => {
    //         if (stream.type != 'ScreenShare') {

    //             // if (stream.getVideoTracks().length) {
    //             //     addVideoNode(participant, stream);
    //             // }

    //             // const participantsList = document.getElementById("participants-list");

    //             // if the participant is the current session user, don’t add them to the list
    //             if (participant.id === VoxeetSDK.session.participant.id) return;

    //             // let participantNode = document.createElement("li");
    //             // participantNode.setAttribute("id", "participant-" + participant.id);
    //             // participantNode.innerText = `${participant.info.name}`;

    //             participantsList = <ul><li>{participant.info.name}</li></ul>;
    //         }
    //     });

    //     // VoxeetSDK.conference.on('streamRemoved', (participant, stream) => {
    //     //     removeParticipantNode(participant);
    //     // });
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
                    <div>
                        {participantsList}
                    </div>
                </div>

                <script src="https://unpkg.com/@voxeet/voxeet-web-sdk@0.3.10/dist/voxeet-sdk.js" type="text/javascript"></script>
                <script src="https://unpkg.com/@voxeet/voxeet-web-sdk" type="text/javascript"></script>

            </div>
        );
    }
};

export default ChatPage;
