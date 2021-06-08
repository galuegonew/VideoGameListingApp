import React, { useState, Fragment, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock} from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import "./LoginPage.css";
import 'bulma/css/bulma.css'

function LoginPage() {
    let history = useHistory();
    const [state, setState] = useState({
        username: "",
        password: "",
        token: "",
        id: "",
        redirectToHomePage: false,
        redirectToSignUpPage: false,
        showError: false,
        invalidCred: false,
    });
    const stateRef = useRef();
    stateRef.current = state;

    /**
     * Logic for performing API call to check if credentials exist in MongoDB. If not, error text is rendered to login box. If so,
     * User is redirected to home page where they are able to navigate to table page and other features of the project.
     */
    const loginAction = useCallback(async (e) => {
        e.preventDefault();
        let creds = {
            Username: "",
            Password: "",
        }
        creds.Username = stateRef.current.username;
        creds.Password = stateRef.current.password;
        try {
            await fetch(
                "http://localhost:3000/api/login",
            {
                method: "POST",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                },
                body: JSON.stringify(creds),
            })
            .then((data) => {
                if(data.status === 200)
                    return data.json()
                else
                    throw new Error();
            })
            .then((data) => {
                setState({
                    ...stateRef.current,
                    token: JSON.stringify(data.token),
                    id: JSON.stringify(data.id),
                    redirectToHomePage: true,
                    redirectToSignUpPage: false,
                    invalidCred: false,
                    username: creds.Username
                })
            });
        }  catch(error) {
            setState({
                ...stateRef.current, 
                error: true,
                invalidCred: true
            });
            console.error(error);
        }
    }, []);

    const signUpAction = useCallback(async (e) => {
        e.preventDefault();
        let creds = {
            Username: "",
            Password: "",
        }
        setState({
            ...stateRef.current,
            token: "",
            id: "",
            redirectToHomePage: false,
            redirectToSignUpPage: true,
            invalidCred: false,
            username: creds.Username
        })
    }, [])

    /**
     * Depending on whether the user is inputting into password or username field,
     * Corresponding state property is set based on user input.
     */
    const handleChange = useCallback((e) => {
        const inputValue = e.target.value;
        setState({
            ...stateRef.current,
            [e.target.name]: inputValue,
            invalidCred: false
        });
        e.preventDefault();
    }, []);

    if(state.redirectToHomePage) {
        history.push("/home");
        return(
            <Redirect
                to={{
                    pathname: `/home`,
                    state: {Username: state.username, id: state.id, token: state.token }
                }}
            ></Redirect>
        )
    }

    if(state.redirectToSignUpPage) {
        history.push("/api/signupage");
        return(
            <Redirect
            to={{
                pathname:'/signuppage'
            }}
            ></Redirect>)
    }

    return (   
        <Fragment id="login-body">
            <div class="container" id="login-content-container">
            <form class="box" id="account-form">
                <table id="login-form">
                    <tbody>
                        <tr>
                            <td id="login-container">
                            <div class="field">
                                <label class="username-label">Username</label>
                                <p class="control has-icons-left has-icons-right">
                                    <input class="input username-field" type="text" name="username" placeholder="Username" onChange={handleChange} required/>
                                    <span class="icon is-small is-left">
                                    <FontAwesomeIcon icon={faUser}/>
                                    </span>
                                </p>
                            </div>
                        
                            <div class="field">
                                <label class="password-label">Password</label>
                                <p class="control has-icons-left">
                                    <input class="input password-field" type="password" name="password" placeholder="Password" onChange={handleChange} required/>
                                    <span class="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock}/>
                                    </span>
                                </p>
                            </div>

                            <div class="field">
                                <p class="control">
                                    <button class="button is-info" id="login-button" onClick={loginAction}>Login</button>
                                    <button class="button is-danger" id="signup-button" onClick={signUpAction}>Sign up</button>
                                </p>
                                {state.invalidCred && <div class="field" id="invalid-credential-container">
                                    <label id="invalid-credentials" class="invalid-credentials-on">Invalid Credentials</label>
                                </div>}
                            </div>
                            </td>

                            <td id="title-container_">
                                <img class="psController" src="psController.png" id="login-logo"  width="100" height="150" alt="PS4 Controller Logo"/>
                                <h1 class="title-header"><b id="branding">Video Games R US</b></h1>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            </div>
        </Fragment>
    );
}

export default LoginPage;