import React, { Fragment } from "react";
import { Box, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TableContent from "./TableContent/TableContent";
import StatsD3 from "../StatsD3/StatsD3";
import "./TableRender.css";
import NavBar from '../../Navbar/Navbar';

/**
 * Generates html for table header, main table and search bar respectively. Logic is added for generating a table header, container,
 * passing state values for other components to use, and generating a search bar for functionaly for adding video games.
 */
function TableRender(props) {
    return (
        <Fragment>
            <NavBar pageOn={"tablepage"} userdata={props.state} userTableData={props.userTableData}/>
            <div class="container">
                <div class="content-tab">
                    {/*  generate table header */}
                    <Box class="table-menu" id="table-addons">
                        <div id="table-addon-container">
                            <span class="table-all" onClick={() => props.showFullTable()}>Show All</span>
                            <span class="table-playing" onClick={() => props.showCurrentlyPlaying()}>Currently Playing</span>
                            <span class="table-completed" onClick={() => props.showCompleted()}>Completed</span>
                            <span class="table-plan" onClick={() => props.sortRating()}>Rating</span>
                            <span onClick={() => props.statsAction()}>Stats</span>
                        </div>
                    </Box>
                    <Box class="table-container" id="table-container">
                        {!props.filterState.stats && <TableContent 
                        tableData={props.userTableData} 
                        removeGame={props.deleteVideoGameRequest} 
                        updateGame={props.updateVideoGameRequest}
                        addGame = {props.searchValue}
                        addSelectedGame={props.selectedValue}
                        vgData = {props.vgData}
                        filteredData={props.filteredVGData}
                        handleAdd={props.handleChange}
                        userdata={props.state}
                        />}
                        {props.filterState.stats && props.userTableData.length !== 0 && <StatsD3 tableData={props.userTableData}/>}
                    </Box>
                    {!props.hideAddBox && <div class="add" id="add-game">
                        <Autocomplete
                            freeSolo
                            id="autoComplete"
                            disableClearable
                            options={props.filteredVGData.map((option) => option.name)}
                            onChange={(event, value) => props.setSelectedValue(value)}
                            renderInput={(params) => (
                                <div id="search-box">
                                    <TextField
                                        {...params}
                                        margin="normal"
                                        variant="outlined"
                                        id="search"
                                        size="medium"
                                        InputLabelProps={{style: {fontSize: 16}}}
                                        onChange={props.handleChange}
                                        value={props.searchValue}
                                        InputProps={{ ...params.InputProps, type: 'search' }}
                                    /> 
                                </div>
                            )}
                        />
                        <span class="button is-primary is-outlined" id="add-row" onClick={() => props.addVideoGameRequest(props.state.id, props.searchValue)}><b>Add Game</b></span>
                    </div>
                    }
                </div>
            </div>
        </Fragment>
    );
}

export default TableRender;