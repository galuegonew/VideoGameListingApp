import TextField from "@material-ui/core/TextField"
import React, { Fragment, useEffect, useRef, useState } from "react"
import io from "socket.io-client"
import "./ChatPage.css"
import NavBar from '../Navbar/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

function ChatPage(props) {
	// declare state values used for messages
	const [ state, setState ] = useState({ message: "", name: "" })
	const [ chat, setChat ] = useState([])
	// declare socket reference
	const socketRef = useRef()

	// connect to socket io
	useEffect(
		() => {
			socketRef.current = io.connect("http://localhost:4000")
			socketRef.current.on("message", ({ name, message }) => {
				setChat([ ...chat, { name, message } ])
			})
			return () => socketRef.current.disconnect()
		},
		[ chat ]
	)
	// check for changes made to the input field (message field)
	const onTextChange = (e) => {
		setState({ ...state, [e.target.name]: e.target.value })
	}
	// handle message submission
	const onMessageSubmit = (e) => {
		const { name, message } = state
		socketRef.current.emit("message", { name, message })
		e.preventDefault()
		setState({ message: "", name })
	}
	// render the front-end of chat by generating emitted mesages
	const renderChat = () => {
		return chat.map(({ name, message }, index) => (
			<div id="messageBox" key={index}>
				<span id="message-username">
					{props.location.state.Username}:
				</span>
				<span id="message-msg">
					{message}
				</span>
			</div>
		))
	}

	return (
		<Fragment>
			{/* import navbar to the top of the page */}
			<NavBar pageOn={"chat"} userdata={props.location.state} />
			<div class="container" id="chat-container">
                <div className="render-chat">
 		  			<h3 id="chat-title">Chat Log</h3>
 		  		    {renderChat()}
 		  		</div>
                <form class="form" id="input-form" onSubmit={onMessageSubmit}>
                    <div id="text-field">
                        <TextField
 		  				name="message"
 		  				onChange={(e) => onTextChange(e)}
 		  				value={state.message}
 		  				id="outlined-multiline-static"
 		  				variant="outlined"
 		  				label="Enter message"
						size="small"
						margin="normal"
						InputLabelProps={{style: {fontSize: 17}}}
 		  			    />
                    </div>
                    <button id="send-button" class="button is-success">
						<span class="icon is-large nav-icon">
                                <FontAwesomeIcon id="send-icon" icon={faPaperPlane}/>
                        </span>
					</button>
                </form>
            </div>
        </Fragment>
	)
}

export default ChatPage