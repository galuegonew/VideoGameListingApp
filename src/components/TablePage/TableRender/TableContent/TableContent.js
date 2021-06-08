import React, { useCallback, useState, Fragment, useRef} from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Snackbar, IconButton } from "@material-ui/core";
import "./TableContent.css";
import $ from 'jquery';

var dropdown = {
    // options for dropdown selections for editting row info
    i: ['1', '2', '3', '4', '5'],
    p: ['Completed', 'Incomplete']
};

// declare variables for row editting
var Immutables = ['r-', 'p-', 'i-'];
var activeEdit = false;

document.addEventListener("click", function(event) {
    // check for changes made to dropdown selectors
    $("select").on("change", function(e) { 
        let target = e.target.id;
        let newValue = document.getElementById(target).value;
        $(`#${target}`).attr('selected', newValue);
   });

});

function editRow(e){
    // function will handle all editing operations made on table rows

    // check if there are no rows in edit mode
    if (!activeEdit){
        e.preventDefault();
        let editCell = e.target;
        // extract id from edit button to identify the intended row
        let rowID = editCell.id.slice(2,editCell.id.length);
        let editButton = document.getElementById(`er${rowID}`);
        let removeButton = document.getElementById(`rr${rowID}`);
        let saveButton = document.getElementById(`sr${rowID}`);
        $(saveButton).removeClass('hidden');
        $(removeButton).addClass('hidden');
        $(editButton).addClass('hidden');
        activeEdit = true;
        // create dropdowns and an input text field for ranking, progress and rating then generate them for user to edit
        for (let i=0; i < Immutables.length; i++){
            let target = document.getElementById(`${Immutables[i]}${rowID}`);
            // set ranking cell to an input text field
            if(i === 0){
                let curValue = $(target).text();
                let input = document.createElement('input');
                $(input).attr('placeholder', curValue);
                $(input).attr('id', 'editInput');
                $(input).attr('class', 'input');
                $(input).attr('type', 'text');
                document.getElementById(target.id).innerText = '';
                document.getElementById(target.id).appendChild(input);
            // set rating and progress cells to dropdown menus
            } else {
                let select = document.createElement('select');
                $(select).attr('id', `s${Immutables[i]}${rowID}`);
                $(select).attr('class', 'select is-info');
                target.innerHTML = '';
                target.appendChild(select);
                let selections = dropdown[select.parentElement.id[0]];
                let content = '';
                // generate corresponding dropdown options for the targetted dropdown menu
                $.each(selections, function (index, value){
                    let defaultValue = document.getElementById(target.id).innerText;
                    if (value === defaultValue){
                        content += `<option selected="selected" value=${value}>${value}</option>`;
                    } else {
                        content += `<option value=${value}>${value}</option>`;
                    }
                });
                select.innerHTML = content;
            }
        }
    }
}


function TableContent(props) {
    let history = useHistory();
    const [showPopup, setPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [redirectToInfoPage, setRedirectToInfoPage] = useState(false);
    const [moreInfoRow, setMoreInfoRow] = useState("");
    const tableDataRef = useRef();
    tableDataRef.current = props.tableData;

    /**
     * jQuery is used instead of React logic in order to fill the objective component of project for jQuery.
     * Function handles all changes made to mutable cells during editting and saves the changes respectively. 
     * Save, edit and remove buttons are generated with their respective ids. Logic is added for input value validation for
     * progress, rating, and ranking. If there are no newly entered values, previous values are used once again.
     * If new values, associated request is made via API to MongoDB and new values are saved in state data and table.
     */
    const saveRow = useCallback((e) => {
        e.preventDefault();
        let rowID = e.target.id.slice(2,e.target.id.length);
        let editButton = document.getElementById(`er${rowID}`);
        let removeButton = document.getElementById(`rr${rowID}`);
        let saveButton = document.getElementById(`sr${rowID}`);
        $(saveButton).addClass('hidden');
        $(removeButton).removeClass('hidden');
        $(editButton).removeClass('hidden');
        let input = document.getElementById('editInput');
        let newValue = input.value;
        const vgIndex = tableDataRef.current.findIndex(videogame => {
            return videogame.id === parseInt(rowID);
        });
        const dataCopy = tableDataRef.current;
        const previousProgress = dataCopy[vgIndex].progress;
        const previousRating = dataCopy[vgIndex].rating;
        if (!newValue){
            let prevValue = $(input).attr('placeholder');
            props.updateGame(rowID, "ranking", parseInt(prevValue));
            document.getElementById(`r-${rowID}`).innerHTML = prevValue;
        } else if(newValue <= 0) {
            resetValues(rowID, dataCopy, vgIndex);
            setPopup(true);
            setPopupMessage("Ranking must be greater than 0.")
            return;
        } else if(!(/^[0-9]*[.]?[0-9]*$/.test(newValue))) {
            resetValues(rowID, dataCopy, vgIndex);
            setPopupMessage("Ranking must be a number.")
            setPopup(true);
            return;
        } else {
            props.updateGame(rowID, "ranking", parseInt(newValue));
            document.getElementById(`r-${rowID}`).innerHTML = newValue;
        }
        let progress = document.getElementById(`p-${rowID}`);
        let rating = document.getElementById(`i-${rowID}`);
        let progressNewValue = document.getElementById(`sp-${rowID}`).value;
        let ratingNewValue = document.getElementById(`si-${rowID}`).value;
        if(progressNewValue !== previousProgress) {
            props.updateGame(rowID, "progress", progressNewValue);
        }
        if(parseInt(ratingNewValue) !== previousRating) {
            props.updateGame(rowID, "rating", parseInt(ratingNewValue));
        }
        progress.innerHTML = progressNewValue;
        rating.innerHTML = ratingNewValue
        activeEdit = false;
        
    }, []);

    const resetValues = useCallback((rowID, dataCopy, vgIndex) => {
        document.getElementById(`r-${rowID}`).innerHTML = dataCopy[vgIndex].ranking;
        document.getElementById(`p-${rowID}`).innerHTML = dataCopy[vgIndex].progress;
        document.getElementById(`i-${rowID}`).innerHTML = dataCopy[vgIndex].rating;
        activeEdit = false;
    }, [])

    if(redirectToInfoPage) {
        history.push("/infopage");
        return(
            <Redirect
                to={{
                    pathname: `/infopage`,
                    tableData: props.tableData,
                    token : props.userdata.token,
                    userdata : props.userdata,
                    moreInfoName : moreInfoRow
                }}
            ></Redirect>
        )
    }

    /**
     * Generates table rows dynamically based on database information.
     */
    const videoGameMap = props.tableData.map((videoGame) => {
        if(isNaN(videoGame.ranking)) {
            videoGame.ranking = "";
        }
        return (
            <tr class="item-data" key={videoGame.id}>
                <td class="item-logo" id='logo'><img class="object-logo" src={videoGame.url} width="25" height="25" alt="Poster"/></td>
                <td class="item-rank" id={'r-'+videoGame.id}>
                    {videoGame.ranking}
                </td>
                <td class="item-title" id='title'>
                    <span id="info-link" onClick={() => { setMoreInfoRow(videoGame.game); setRedirectToInfoPage(true);}}>
                        {videoGame.game}
                    </span>
                </td>
                <td class="item-progress" id={'p-'+videoGame.id}>{videoGame.progress}</td>
                <td class="item-genre"  id='genre'>{videoGame.genre}</td>
                <td class="item-rating" id={'i-'+videoGame.id}>{videoGame.rating}</td>
                <td class="edit-remove" id={'e-'+videoGame.id}>
                    <div id="control">
                        <img class="save-row hidden" id={'sr'+videoGame.id} onClick={saveRow} src="../save.png" alt="Save" />
                        <img class="edit-row" id={'er'+videoGame.id} onClick={editRow} src="../edit1.png" alt="Edit"/>
                        <img class="remove-row"  id={'rr'+videoGame.id} onClick={() => props.removeGame(videoGame.id)} src="../delete.png" alt="Delete"/>
                    </div>
                </td>
            </tr>
        )
    })

    return (
        <Fragment>
            {props.tableData.length !== 0 && 
                <table class="table">
                    <thead>
                        <tr>
                            <th id="logoHeader"></th>
                            <th><span id="sortable">Ranking</span></th>
                            <th><span  id="sortable">Title</span ></th>
                            <th><span  id="sortable">Progress</span></th>
                            <th><span  id="sortable">Genre</span ></th>
                            <th colSpan="1"><span  id="sortable">Rating</span ></th>
                        </tr>
                    </thead>
                    <tbody class="item-block">
                        {videoGameMap}
                    </tbody>
                </table> 
            }
            {props.tableData.length === 0 &&
                <p id="empty-block">No video games added!</p>
            }
            {/* popup notification for wrong input */}
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={showPopup}
                autoHideDuration={5000}
                onClose={() => setPopup(false)}
                message={popupMessage}
                action={
                <React.Fragment>
                    <IconButton size="small" aria-label="close" color="inherit" onClick={() => setPopup(false)}>
                    </IconButton>
                </React.Fragment>
                }
            />
        </Fragment>
    );
}

export default TableContent;