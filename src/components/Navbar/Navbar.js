import React, { useState, Fragment } from 'react';
import { Redirect } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faTable, faComment } from '@fortawesome/free-solid-svg-icons'
import Navbar from 'react-bootstrap/Navbar'
import { NavDropdown, Nav } from 'react-bootstrap';
import { useHistory } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar(props){
    let history = useHistory();
    // declare state variables used for redirecting and routing
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [redirectToChat, setRedirectToChat] = useState(false);
    const [redirectToTablePage, setRedirectToTablePage] = useState(false);
    const [redirectToHomePage, setRedirectToHomePage] = useState(false);
   
    // check to redirect to login page
    if(redirectToLogin) {
        history.push("/");
        return(
            <Redirect
                to={{
                    pathname: `/`,
                }}
            ></Redirect>
        )
    }
    // check to redirect to chat page
    if(redirectToChat && props.pageOn !== "chat") {
        history.push("/chatpage");
        return(
            <Redirect
                to={{
                    pathname: `/chatpage`,
                    state: props.userdata,
                }}
            ></Redirect>
        )
    }
    // check to direct to table page
    if(redirectToTablePage && props.pageOn !== "tablepage") {
        history.push("/tablepage");
        return(
            <Redirect
                to={{
                    pathname: `/tablepage`,
                    state: props.userdata,
                }}
            ></Redirect>
        )
    }
    // check for redirecting to home page
    if(redirectToHomePage && props.pageOn !== "home") {
        history.push("/home");
        return(
            <Redirect
                to={{
                    pathname: `/home`,
                    state: props.userdata,
                }}
            ></Redirect>
        )
    }
    return (
        // create navbar components
        <Fragment>
            <Navbar id="navbar" collapseOnSelect expand="lg" bg="primary" variant="dark">
                <div class="container" id="nav-container">
                    <div id="brand">
                        <img id="navbar-logo" src="../psController.png" alt="PS4 Controller"/>
                        <Navbar.Brand id="navbar-title" href="" onClick={() => setRedirectToHomePage(true)}><b>Video Games R US</b></Navbar.Brand>
                    </div>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        {/* navbar redirect menu goes here */}
                        <Nav id="nav-menu" className="mr-auto">
                            <Nav.Link id="menu" onClick={() => setRedirectToHomePage(true)}>
                                <span class="icon is-small is-left nav-icon">
                                    <FontAwesomeIcon icon={faHome}/>
                                </span>
                                Home
                            </Nav.Link>
                            <Nav.Link id="menu" onClick={() => setRedirectToTablePage(true)}>
                                                                
                                <span class="icon is-small is-left nav-icon">
                                    <FontAwesomeIcon icon={faTable}/>
                                </span>
                                My List
                            </Nav.Link>
                            <Nav.Link id="menu" onClick={() => setRedirectToChat(true)}>                               
                                <span class="icon is-small is-left nav-icon">
                                    <FontAwesomeIcon icon={faComment}/>
                                </span>
                                Chat
                            </Nav.Link>
                        </Nav>
                         {/* navbar login button goes here, it will appear only if the user is not logged in */}
                        {!props.userdata.Username && <Nav id="login-section" class="">
                            <Nav.Link onClick={() => setRedirectToLogin(true)} class="" id="loginBtn" href="#loginPage">
                                Login
                            </Nav.Link>
                        </Nav>}
                        {/* navbar user account dropdown goes here, it will appear only if the user is logged in */}
                        {props.userdata.Username && <Nav id="account-dropdown">
                            <NavDropdown class="dropdownBtn hidden" title={props.userdata.Username} id="collasible-nav-dropdown">
                                <NavDropdown.Item id="logoutBtn" onClick={() => setRedirectToLogin(true)}>Log Out</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>}
                    </Navbar.Collapse>
                </div>
            </Navbar>
        </Fragment>
  );
};

export default NavBar;