import React, { Fragment } from "react"
import "./Home.css"
import NavBar from '../Navbar/Navbar';

/**
 * Home page that shows an overview of the web app with the key features.
 * Each key feature has a short description with an image to show it
 * 
 * @param {*} props 
 * @returns 
 */
function Home(props) {
	return (
		<Fragment>
			{/* import navbar at the top of the page */}
			<NavBar pageOn={"home"} userdata={props.location.state} />
			{/* title for the home page */}
			<div class="container" id="home-header-container">
				<b>WELCOME TO VIDEO GAMES R US</b>
				<p>Organize, Rank, And Chat About Your Favourite Games</p>
			</div>
			{/* Introduction block */}
			<div class="container" id="home-body-container">
				<div id="intro-block">
					<div id="intro">
						<b>Introduction</b>
						<p>
							Welcome to our group's CSCI3230U Major Project application! This web application allows for listing your favourite video games and chatting
							with other users about anything video game related! Created by Albert Galuego, Shayan Khosravi, Jevon Rambarran, and Connor Robertson.
							Our project's features are listed below.
						</p>
					</div>
				</div>
				{/* Feature one: Login/signup */}
				<div id="login-or-signup-image">
					<div id="image-label-1">
						<b>Login or Signup</b>
						<p>
							Enter credentials to login to Video Games R US, or create a new account by visiting the sign up page. Basic authentication is implemented using
							JSON web tokens!
						</p>
					</div>
					<img src="loginsignup.png" width="450" height="auto" alt="Login"></img>
				</div>
				{/* Feature two: game tracker page*/}
				<div id="tablepage-image">
					<div id="image-label-2">
						<b>Add/Remove/Modify your game tracker</b>
						<p>
							Search for your favourite game and add it to your list. 
							Set the ranking, progress and give it a rating!
						</p>
					</div>
					<img src="table.png" width="450" height="auto" alt="Game Tracker"></img>
				</div>
				{/* Feature three: stats page */}
				<div id="stats-image">
					<div id="image-label-3">
						<b>View your statistics</b>
						<p>Check out some graphs of your video games list.</p>
					</div>
					<img src="stats.png" width="450" height="auto" alt="Stats"></img>
				</div>
				{/* Feature four: chat page */}
				<div id="chatbox-image">
					<div id="image-label-4">
						<b>Chatbox</b>
						<p>Chat with others about your favourite games, or games that you think are overrated :)</p>
					</div>
					<img src="chatlog.png" width="450" height="auto" alt="Chat Box"></img>
				</div>
				{/* Feature five: more info page */}
				<div id="moreinfo-image">
					<div id="image-label-5">
						<b>More Information</b>
						<p>To see additional information about a game just click the title of a game on your game tracker.</p>
					</div>
					<img src="moreinfo.png" width="450" height="auto" alt="More Info"></img>
				</div>
			</div>
        </Fragment>
	)
}

export default Home