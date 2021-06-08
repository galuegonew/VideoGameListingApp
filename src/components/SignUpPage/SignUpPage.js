import React, { useState, Fragment, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faCheck, faLock} from '@fortawesome/free-solid-svg-icons'
import { useHistory } from "react-router-dom";
import { Redirect } from "react-router-dom";
import "./SignUpPage.css";
import 'bulma/css/bulma.css'


function SignUpPage() {
    let history = useHistory();
    /**
     * username is the user's username that they create
     * password is the user's password that they create
     * passwordCheck is to check against the user's password 
     * to ensure no typos were made
     * token is used verify the user
     * id: is the user's userID
     * redirecToHome takes the user to the HomePage
     * invalidPass is true when the two passwords do not match
     * takenUsername is true when the username is found in the database
     */
    const [state, setState] = useState({
        username: "", 
        password: "",
        passwordCheck: "",
        token: "",
        id: "",
        redirectToHome: false,
        invalidPass: false,
        takenUsername: false,
    });
    const stateRef = useRef();
    stateRef.current = state;

    /**
     * First checks the password and the second password input to make
     * sure the User inputs the correct password.
     * Checks the database for Usernames equal to new user's username
     * Only if the Username is not taken, create a new user.
     * Return the id of the new User.
     * Once a new User is created, then create an empty list of video 
     * Games for that User.
     */
    const createAccAction = useCallback(async (e) => {
        e.preventDefault();
        let creds = {
            Username: "",
            Password: "",
        }
        let passwordCheck = stateRef.current.passwordCheck;
        creds.Username = stateRef.current.username;
        creds.Password = stateRef.current.password;
        await checkUser(creds);
        try {
            if (passwordCheck === creds.Password) {
                if(!stateRef.current.takenUsername) {
                    try{
                        await register(creds)
                    } catch(error){
                        setState({
                            ...stateRef.current, 
                            error: true,
                        });
                        console.error(error);
                    }
                    try{
                        let user = {
                            userID: stateRef.current.id
                        };
                        await userGamesList(user)

                    } catch(error) {
                        setState({
                            ...stateRef.current,
                            error: true,
                            invalidPass: true
                        });
                        console.error(error);
                    }
                    try{
                        await login(creds)
                    } catch(error) {
                        setState({
                            ...stateRef.current, 
                            error: true,
                        });
                        console.error(error);
                    }
                }             
                } else{
                    setState({
                    ...stateRef.current, 
                    invalidPass: true,
                })
                    throw new Error();
                }
                } catch(error) {
                setState({
                    ...stateRef.current, 
                    error: true,
                });
                console.error(error);
            }
    }, []);


    /**
     * fetchs checkuser api which looks at the users db
     * checks that db for users with the same username as
     * the current credentials, if there is none then it
     * gives a positive response otherwise it returns bad
     * request.
     */
    const checkUser = useCallback(async (creds) => {
        try{
            await fetch(
                "http://localhost:3000/api/checkuser",
            {
                method: "POST",
                headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                },
                body: JSON.stringify(creds),
            })
            .then((data) => {
                if(data.status === 200){
                    return data.json();
                }
                else if(data.status === 400){
                    setUserNameAsync();
                    return 400;
                }                             
            })
            .then((response) => {
                if(response === 400) {
                    return;
                } else {
                    setState({
                        ...stateRef.current,
                        error: false,
                        takenUsername: false,
                    })
                }
            });
        } catch(error) {
            setState({
                ...stateRef.current, 
                error: true,
            });
            console.error(error);
        }
    },[]);

    const setUserNameAsync = useCallback(async () => {
        await setState({
            ...stateRef.current, 
            error: false,
            takenUsername: true,
        });
    }, []);

    /**
     * calls register api which creates a new user with 
     * the credentials that are passed to it. It then returns the ID
     * of the user which is used to create an associated 
     * usersgameslist. 
     */
    const register = useCallback(async (creds) => {
        await fetch(
            "http://localhost:3000/api/register",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(creds),
            })
        .then((data) => {
            if(data.status === 200){
                return data.json()
            }
            else
                throw new Error();
        }).then((response) => {
            setState({
                ...stateRef.current,
                id: response,
            })
        })

    },[]);

    /**
     * calls usergameslist api which creates a new usersgameslists
     * with the user's ID that gets passed to it. 
     */

    const userGamesList = useCallback(async (user) => {
        await fetch(
            "http://localhost:3000/api/usergameslist",
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            body: JSON.stringify(user),
        })
        .then((data) => {
            if(data.status === 200)
                return data.json
            else
                throw new Error();
        })
    }, []);

    /**
     * calls login api which logs the freshly created user in
     * with the credentials that get passed to it. Then it 
     * redirects to home page
     */
    const login = useCallback(async (creds)=> {
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
                redirectToHome: true,
                username: creds.Username
            })
        });
      }, []);


    /**
     * Updates state when text fields are changed.
     */
    const handleChange = useCallback((e) => {
        const inputValue = e.target.value;
        setState({
            ...stateRef.current,
            [e.target.name]: inputValue,
            invalidPass: false
        });
        e.preventDefault();
    }, []);

    if(state.redirectToHome) {
        history.push("/home");
        return(
            <Redirect
                to={{
                    pathname: `/home`,
                    state: { 
                        Username: state.username,
                        id: state.id, 
                        token: state.token 
                    }
                }}
            ></Redirect>
        )
    }

    return (   
        <Fragment id="login-body">
            <div class="container" id="login-content-container">
            <form class="box" id="account-form">
                <table id="login-form">
                    <tbody>
                        <tr> 
                            <td id="login-container">  
                            <strong>Please Make an Account</strong>
                            <div class="field">
                                <label class="username-label">Username</label>
                                <p class="control has-icons-left has-icons-right">
                                    <input class="input username-field" type="text" name="username" placeholder="Username" onChange={handleChange} required/>
                                    <span class="icon is-small is-left">
                                    <FontAwesomeIcon icon={faUser}/>
                                    </span>
                                    <span class="icon is-small is-right">
                                    <FontAwesomeIcon icon={faCheck}/>
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
                                <label class="check-password-label">Confirm Password</label>
                                <p class="control has-icons-left">
                                    <input class="input password-field" type="password" name="passwordCheck" placeholder="Confirm Password" onChange={handleChange} required/>
                                    <span class="icon is-small is-left">
                                    <FontAwesomeIcon icon={faLock}/>
                                    </span>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control">
                                    <button class="button is-info" id="create-button" onClick={createAccAction}>Create Account</button>
                                </p>
                            
                                {state.invalidPass && <div class="field" id="invalid-password-container">
                                    <label id="invalid-password" class="invalid-password-on">Passwords Different</label>
                                </div>}

                                {state.takenUsername && <div class="field" id="invalid-username-container">
                                    <label id="invalid-username" class="invalid-username-on">Username Taken</label>
                                </div>}
                            </div>                        
                            </td>

                            <td id="title-container__">
                                <img class="psController" src="psController.png" id="login-logo"  width="100" height="150" alt="PS4 Controller"/>
                                <h1 class="title-header"><b>Video Games R US</b></h1>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
            </div>
        </Fragment>
    );
}
export default SignUpPage;