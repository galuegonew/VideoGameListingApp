import React, { useState, useEffect, useCallback, useRef } from "react";
import * as d3 from "d3";
import TableRender from "./TableRender/TableRender"

function TablePage(props) {
    /**
     * State and ref initialization for all data required for table and to be sent to child components
     */
    const [userTableData, setUserTableData] = useState([]);
    const [fullGameList, setFullGameList] = useState([]);
    const [vgData, setVGData] = useState([]);
    const [vgImageData, setVGImageData] = useState([]);
    const [filteredVGData, setFilteredVGData] = useState([]);
    const [searchValue, setValue] = useState(""); // search state value
    const [selectedValue, setSelectedValue] = useState({}); 
    const [hideAddBox, setHideAddBox] = useState(false);
    const [state, setState] = useState({
        Username: "",
        id: "",
        token: ""
    });
    const [filterState, setFilterState] = useState({
        all: true,
        currentlyPlaying: false,
        completed: false,
        rating: false,
        stats: false
    });
    const stateRef = useRef();
    const tableDataRef = useRef();
    const fullGameListRef = useRef();
    const filterStateRef = useRef();
    const vgDataRef = useRef();
    const vgImageDataRef = useRef();
    const filteredVGDataRef = useRef();
    const selectedValueRef = useRef();
    stateRef.current = state;
    tableDataRef.current = userTableData;
    fullGameListRef.current = fullGameList;
    filterStateRef.current = filterState;
    vgDataRef.current = vgData;
    vgImageDataRef.current = vgImageData;
    filteredVGDataRef.current = filteredVGData;
    selectedValueRef.current = selectedValue;

    /**
     * Initialization logic for Tablepage component. await is used to wait for state to be set before attempting to perform additional API
     * calls as JSON web token is needed for user authorization into backend.
     */
    useEffect(async () => {
        await setState({
            Username: props.location.state.Username,
            id: props.location.state.id,
            token: props.location.state.token
        })   
        getUserList();
        getVideoGameDataListing();
        getVideoGameImageData();
    }, []);

    /**
     * API call for retrieving data for user-specific video game list/table data. This is the first thing performed when component
     * renders
     */
    const getUserList = useCallback(async () => {
        try {
            await fetch(
                "http://localhost:3000/api/usersgameslisting?userID=" + stateRef.current.id,
            {
                method: "GET",
                headers: {
                    "token": stateRef.current.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }
            })
            .then((data) => data.json())
            .then((response) => {
                response.games.sort((a,b) => (a.ranking > b.ranking) ? 1 : ((b.ranking > a.ranking) ? -1 : 0));
                setFullGameList(response.games);
                setUserTableData(response.games);
            });
        }  catch(error) {
            console.error(error);
        }
    }, []);

    /**
     * Gets entire data array regarding all of the video games that can be added to the table from associated /api/videogamelisting API route.
     * This data is saved into an array state object and will be used for filtering certain video games for the add game search bar.
     */
    const getVideoGameDataListing = useCallback(async () => {
        try {
            await fetch(
                "http://localhost:3000/api/videogamelisting",
            {
                method: "GET",
                headers: {
                    "token": stateRef.current.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
            .then((data) => data.json())
            .then((listing) => {
                setVGData(listing);
            });
        }  catch(error) {
            console.error(error);
        }
    }, []);

    /**
     * Gets entire data array regarding all of the video game images that can be added to the table from associated /api/videogameimages API route.
     */
    const getVideoGameImageData = useCallback(async () => {
        try {
            await fetch(
                "http://localhost:3000/api/videogameimages",
            {
                method: "GET",
                headers: {
                    "token": stateRef.current.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
            .then((data) => data.json())
            .then((listing) => {
                setVGImageData(listing);
            });
        }  catch(error) {
            console.error(error);
        }
    }, []);

    /**
     * Gets the filtered list of games from the videogames state array object when a user types into the add search bar.
     */
    const getFilteredListOfGames = useCallback((name) => {
        let count = 0;
        const filteredVGList = vgDataRef.current.filter((videogames) => {
            return (
                videogames.name.toLowerCase().indexOf(name.toLowerCase()) !== -1 && count++ < 10
            );
        });
        setFilteredVGData(filteredVGList);
    }, []);

    /**
     * Adds an object to the current data listed in the table. This is done when a user clicks add game in the add bar search bar.
     * Essentially adds a game to be displayed in the table.
     */
    const addVideoGameRow = useCallback((newGameObj) => {
        let newVideoGameList = [...fullGameListRef.current, newGameObj];
        return newVideoGameList;
    }, []);

    /**
     * Performs a POST API call for add game to add an extra object representing the newly added game to the MongoDB database csci3230u collection
     * usersgameslists associated user document games array. generateNewGameObj(used for generating game object that will be passed into the body of
     * fetch call). If fetch call succeeds (meaning data was saved in MongoDB) logic exists for adding the newly created object to the state data to 
     * be displayed on the table.
     */
    const addVideoGameRequest = useCallback(async (userID) => {
        var newGameObj = setGame(selectedValueRef.current);
        const newGame = await generateNewGameObj(newGameObj);
        
        let requestBody = {
            userID: userID,
            newGame: newGame
        };
        try {
            await fetch(
                "http://localhost:3000/api/usersgameslisting/addgame/",
            {
                method: "POST",
                headers: {
                    "token": stateRef.current.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })
            .then((data) => data.json())
            .then((response) => {
                const newVideoGameList = addVideoGameRow(newGame);
                newVideoGameList.sort((a,b) => (a.ranking > b.ranking) ? 1 : ((b.ranking > a.ranking) ? -1 : 0));
                setFullGameList([...newVideoGameList]);
                checkTableFilter();
            });
        }  catch(error) {
            console.error(error);
        }
    }, []);

    /**
     * Creates a new game object that can be added to the current state data table listing. Creates a new unique id for each video game
     * and adds the associated url from filtering the image state data listing.
     */
    const generateNewGameObj = useCallback(async (newGameObj) => {
        let newGame = {
            genre: newGameObj.genres.split(';')[0],
            ranking: "",
            game: newGameObj.name,
            rating: "1",
            progress: "Incomplete",
        };

        let idExists = true;
        let globalnewID;
        while(idExists) {
            let newID = Date.now();
            globalnewID = newID
            idExists = tableDataRef.current.some(videogame => videogame.id === newID )
        }
        
        newGame["id"] = globalnewID;
        if(checkImageExists(newGameObj.appid)) {
            await findImage(newGameObj.appid).then(result => {
                newGame["url"] = result;
            });
        }
        return newGame;
    }, []);

    /**
     * Searches for an entry in the video game state listing for a game name specified by the user.
     */
    const setGame = useCallback((gameName) => {
        let returnValue = {};
        filteredVGDataRef.current.forEach((value) => {
            if(value.name === gameName) {
                returnValue = value;
                return value;
            }
        })
        return returnValue;
    }, [])

    /**
     * Verifies an image exists. Used before findImage function is called to verify it exists before filtering
     * 27000 entries of data in the images state array.
     */
    const checkImageExists = useCallback((appID) => {
        return vgImageDataRef.current.some(item => item.steam_appid === appID)
    }, [])

    /**
     * Verifies an image exists. Used before findImage function is called to verify it exists before filtering
     * 27000 entries of data in the images state array.
     */
    const findImage = useCallback(async (appID) => {
        return new Promise((resolve) => {
            const url = vgImageDataRef.current.filter((videogameurls) => {
                return videogameurls.steam_appid === appID;
            });
            resolve(url[0].header_image);
        });
    }, []);

    /**
     * Returns a new version of the fullGameListRef with newly updated data applied to specific object in current table list state data.
     */
    const updateVideoGameRow = useCallback((id, header, newValue) => {
        const vgIndex = fullGameListRef.current.findIndex(videogame => videogame.id == id )
        let dataCopy = fullGameListRef.current;
        dataCopy[vgIndex] = {...dataCopy[vgIndex], [header]: newValue}
        return dataCopy;
    }, []);

    /**
     * Returns a new version of the fullGameListRef with newly updated data applied to specific object in current table list state data.
     */
    const updateVideoGameRequest = useCallback(async (videoGameID, header, newValue) => {
        if(!validInput(header, newValue)) {
            console.error("Invalid input for updating");
            return;
        }
        try {
            await fetch(
                "http://localhost:3000/api/usersgameslisting/editgame",
            {
                method: "PUT",
                headers: {
                    "token": stateRef.current.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({userID: stateRef.current.id, id: videoGameID, header: header, value: newValue}),
            })
            .then((data) => data.json())
            .then((response) => {
                const newVideoGameList = updateVideoGameRow(videoGameID, header, newValue);
                newVideoGameList.sort((a,b) => (a.ranking > b.ranking) ? 1 : ((b.ranking > a.ranking) ? -1 : 0));
                setFullGameList([...newVideoGameList]);
                checkTableFilter();
            });
        }  catch(error) {
            console.error(error);
        }
    }, []);

    /**
     * Checks if data inputted by user is valid for ranking, rating, progress, and genre.
     */
    const validInput = useCallback((header, value) => {
        if(Number.isInteger(value) && (header !== "rating" && header !== "ranking")) {
            return false;
        } 
        if ((typeof value == "string" || (value instanceof String)) && (header !== "progress" && header !== "game" && header !== "genre")) {
            return false;
        }
        return true;
    }, []);

    /**
     * Returns a new array with entry or game specified by user to be deleted.
     */
    const deleteVideoGameRow = useCallback((id) => {
        let newVideoGameList = fullGameListRef.current.filter((videogame) => {
            return videogame.id !== id;
        });
        return newVideoGameList;
    }, []);
      
    /**
     * DELETE request used for deleting video game or table entries from the corresponding user document in MongoDB. Also updates the table data to be displayed
     * on the table.
     */
    const deleteVideoGameRequest = useCallback(async (videoGameID) => {
        try {
            await fetch(
                "http://localhost:3000/api/usersgameslisting/deletegame?userID=" + stateRef.current.id + "&videoGameID=" + videoGameID,
            {
                method: "DELETE",
                headers: {
                    "token": stateRef.current.token,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            })
            .then((data) => data.json())
            .then((response) => {
                const newVideoGameList = deleteVideoGameRow(videoGameID);
                setFullGameList([...newVideoGameList]);
                checkTableFilter();
            });
        }  catch(error) {
            console.error(error);
        }
    }, []);

    /**
     * Filter for showing all of the table data from the corresponding user document in MongoDB.
     */
    const showFullTable = useCallback(() => {
        setHideAddBox(false);
        setFilterState({ all: true, currentlyPlaying: false, completed: false, rating: false, stats: false});
        d3.select("#graphContainer").remove();
        fullGameListRef.current.sort((a,b) => (a.ranking > b.ranking) ? 1 : ((b.ranking > a.ranking) ? -1 : 0));
        setUserTableData([...fullGameListRef.current]);
    }, []);

    /**
     * Filter for only showing table data or video games that have progress property set to "Incomplete".
     */
    const showCurrentlyPlaying = useCallback(() => {
        setHideAddBox(false);
        setFilterState({all: false, currentlyPlaying: true, completed: false, rating: false, stats: false});
        d3.select("#graphContainer").remove();
        const filteredCurrentlyPlaying = fullGameListRef.current.filter((videogame) => {
            return videogame.progress === "Incomplete";
        });
        setUserTableData([...filteredCurrentlyPlaying]);
    }, []);

    /**
     * Filter for only showing table data or video games that have progress property set to "Complete".
     */
    const showCompleted = useCallback(() => {
        setHideAddBox(false);
        setFilterState({all: false, currentlyPlaying: false, completed: true, rating: false, stats: false});
        d3.select("#graphContainer").remove();

        const filteredCompleted = fullGameListRef.current.filter((videogame) => {
            return videogame.progress === "Completed";
        });
        setUserTableData([...filteredCompleted]);
    }, []);

    /**
     * Filter for sorting table data or video games based on rating.
     */
    const sortRating = useCallback(() => {
        setHideAddBox(false);
        setFilterState({all: false, currentlyPlaying: false, completed: false, rating: true, stats: false});
        d3.select("#graphContainer").remove();

        const ratingSorted = fullGameListRef.current;
        ratingSorted.sort((a,b) => (a.rating > b.rating) ? 1 : ((b.rating > a.rating) ? -1 : 0))
        setUserTableData([...ratingSorted]);
    }, []);

    /**
     * Logic for showing D3 component or statistics of table data in bar, pie graph,
     */
    const statsAction = useCallback(() => {
        if(tableDataRef.current.length !== 0) {
            setFilterState({ all: false, currentlyPlaying: false, completed: false, rating: false, stats: true});
            setHideAddBox(true);
        }
    }, []);

    /**
     * Determine which filter to show for table based on state data using filterStateRef.
     */
    const checkTableFilter = useCallback(() => {
        if(filterStateRef.current.all) {
            showFullTable();
        } else if(filterStateRef.current.currentlyPlaying) {
            showCurrentlyPlaying();
        } else if(filterStateRef.current.completed) {
            showCompleted();
        }
    })

    /**
     * Calls getFilteredListOfGames to return filtered videogames from large list of video games state data based on
     * input from user.
     */
    const handleChange = useCallback((e) => {
        getFilteredListOfGames(e.target.value);
        setValue(e.target.value);
    })

    return <TableRender 
        state={state}
        userTableData={userTableData}
        showFullTable={showFullTable}
        showCurrentlyPlaying={showCurrentlyPlaying}
        showCompleted={showCompleted}
        sortRating={sortRating}
        statsAction={statsAction}
        filterState={filterState}
        deleteVideoGameRequest={deleteVideoGameRequest}
        updateVideoGameRequest={updateVideoGameRequest}
        searchValue={searchValue}
        selectedValue={selectedValue}
        vgData={vgData}
        filteredVGData={filteredVGData}
        handleChange={handleChange}
        hideAddBox={hideAddBox}
        setSelectedValue={setSelectedValue}
        addVideoGameRequest={addVideoGameRequest}
    />
}

export default TablePage;