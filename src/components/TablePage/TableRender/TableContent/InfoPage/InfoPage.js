import React, { Fragment, useEffect, useCallback, useState, useRef } from "react"
import "./InfoPage.css"
import NavBar from '../../../../Navbar/Navbar';

/**
 * covertEnglishToYes(english) will clean up our english variable before displaying it.
 * The database has english as '1' which means it is in english, instead display 'yes' 
 * or 'no' as this is more meaningful.
 * 
 * @param {*} english -> String of english value
 * @returns 
 */
function covertEnglishToYes(english){
    if(english === "1"){
        return "Yes";
    }else{
        return "No";
    }
}

/**
 * convertNoRequiredAge(age) will clean up our age variable before displaying it. The 
 * database sometimes has age '0' which doesn't make much sense, instead change 
 * it to 'no required age'
 * 
 * @param {*} age -> String of the age
 * @returns 
 */
function convertNoRequiredAge(age){
    if(age === "0"){
        return "No Required Age";
    } else{
        return age;
    }
}

/**
 * The info page will be loaded once a user clicks on the title of a game
 * in their game tracker.This page provides all the additional information
 * for their game.
 * 
 * @param {*} props 
 * @returns 
 */
function InfoPage(props) {
    const [vgMoreInfoData, setVgMoreInfoData] = useState([]);
    const [vgMoreInfoImage, setVgMoreInfoImage] = useState([]);

    const vgMoreInfoDataRef = useRef();
    vgMoreInfoDataRef.current = vgMoreInfoData;

    const vgMoreInfoImageRef = useRef();
    vgMoreInfoImageRef.current = vgMoreInfoImage;

	useEffect(async () => {
        await getMoreInfo();
        await getMoreInfoImage();
	}, []);

    // getMoreInfo will send a request to fetch all of
    // the corresponding video game data from our database
	const getMoreInfo = useCallback(async () => {
		let requestBody = {
            gameName: props.location.moreInfoName,
        };
		console.log(requestBody);
        try {
            await fetch(
                "http://localhost:3000/api/moreinfo",
            {
                method: "POST",
                headers: {
                    "token": props.location.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
				body: JSON.stringify(requestBody),
            })
            .then((data) => data.json())
            .then((listing) => {
                setVgMoreInfoData(listing)
            });
        }  catch(error) {
            console.error(error);
        }
        
    }, [props.location.moreInfoName, props.location.token]);

    // getMoreInfoImage will send a request to fetch the 
    // corresponding video game poster from our database
    const getMoreInfoImage = useCallback(async () => {

        let requestBody = {
            gameAppID: vgMoreInfoDataRef.current.appid,
        };

        try {
            await fetch(
                "http://localhost:3000/api/moreinfo/gameimage",
            {
                method: "POST",
                headers: {
                    "token": props.location.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })
            .then((data) => data.json())
            .then((listing) => {
                setVgMoreInfoImage(listing);
            });
        }  catch(error) {
            console.error(error);
        }
    }, [props.location.token]);

	return (
		<Fragment>
            {/* import navbar at the top of the page */}
			<NavBar pageOn={"infopage"} userdata={props.location.userdata} userTableData={props.location.tableData} />
            {/* title for the info page which will be our video game name */}
            <div class="container" id="info-header-container">
				<b>{vgMoreInfoData.name}</b>
			</div>
            {/* display all our data for each game in a simple form */}
            <div class="container" id="info-body-container">
                <div id="game-image-container">
                    <img src={vgMoreInfoImage.header_image} alt="Game Header Logo"></img>
                </div>
                <div id ="extra-info-container">
                    <form>
                        <div class="label-input-box">
                            <label><b>Name: </b> </label>
                            <input class="input" type="text" value={vgMoreInfoData.name} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Release Date: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.release_date} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>English: </b></label>
                            <input class="input" type="text" value={covertEnglishToYes(vgMoreInfoData.english)} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Developer: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.developer} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Publisher: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.publisher} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Required Age: </b></label>
                            <input class="input" type="text" value={convertNoRequiredAge(vgMoreInfoData.required_age)} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Categories: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.categories} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Genres: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.genres} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Tags: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.steamspy_tags} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Achievements: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.achievements} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Positive Ratings: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.positive_ratings} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Negative Ratings: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.negative_ratings} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Average Playtime: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.average_playtime} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Median Playtime: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.median_playtime} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Owners: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.owners} readOnly></input>
                        </div>
                        <div class="label-input-box">
                            <label><b>Price: </b></label>
                            <input class="input" type="text" value={vgMoreInfoData.price} readOnly></input>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
	)
}

export default InfoPage