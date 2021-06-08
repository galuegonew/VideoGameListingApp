import React from "react";
import "./StatsD3.css";
import * as d3 from 'd3';

/**
 * getGenreFrequency(data) will process the data creating a list of 
 * dictionaries for genre and frequency. To lists are created 'graphData' for
 * the bar chart and 'pieChartData' for the pie chart
 * 
 * @param {*} data --> Contains all of the data in the table
 */
function getGenreFrequency(data) {
    // Variables
    var genreFrequency = [];
    var graphData = [];
    var pieChartData = [];

    // Get all of the genres from data and append to a list
    for(let i = 0; i < data.length; i++){
        genreFrequency.push(data[i].genre);
    }

    // Counts the number of occurences for each genre
    const countUnique = genreFrequency => {
        const counts = {};
        for (var i = 0; i < genreFrequency.length; i++) {
           counts[genreFrequency[i]] = 1 + (counts[genreFrequency[i]] || 0);
        };
        return counts;
     };

    // For each unique genre, create a new dictionary {genre:?, freq:?}
    // and append to a new list
    for (const property in countUnique(genreFrequency)) {
        let dict = {};
        dict["genre"] = property;
        dict["freq"] = countUnique(genreFrequency)[property]
        graphData.push(dict);
    }
    
    // Convert the frequency of genre to percentage
    for(let i = 0; i < graphData.length; i++){
         graphData[i].freq = graphData[i].freq/genreFrequency.length;
    }

    // Add just the frequencies to a list to make pie chart creation easier
    for(let i = 0; i < graphData.length; i++){
        pieChartData.push(graphData[i].freq);
    }

    // Draw the Pie chart passing along the bar chart data and pie chart data
    drawPieChart(graphData, pieChartData);
}

/**
 * drawPieChart(freqData, pieChartData) will draw the pie chart for the 
 * genres. When the chart is clicked it will change to a bar chart
 * 
 * @param {*} freqData --> Bar chart data (used for click handler)
 * @param {*} pieChartData pie chart data (used to generate the pie chart)
 */
function drawPieChart(freqData, pieChartData) {
    // Remove svg if it exist -> in the case of bar chart being active
    d3.select("#graphContainer").remove();

    // Variables for dimensions
    const margin = 50;
    const width = 500;
    const height = 300;
    const radius = Math.min(width+100, height+100) / 2 - margin;

    // Color for the pie slices, 6 different colours used and if more than 6 genres, color will go 
    // back to first index and continue
    const color = d3.scaleOrdinal(['#33cc00','#00ffff','#e63900','#737373','#e600ac', '#ff6600']);

    // Create SVG container, set the attributes and append to table
    // Opacity is initially set to 0
    let svg = d3.select('#table-container')
                    .append('svg')
                        .attr('id', 'graphContainer')
                        .attr('width', width+300)
                        .attr('height', height)
                        .attr('display', 'block')
                        .attr('margin', 'auto')
                        .attr('transform', `translate(${0}, ${margin})`)
                        .style("opacity", 0);
    
    // Fade in the svg container by transitioning the opacity from 0 to 1
    // in 3 seconds
    d3.select("#graphContainer")
          .transition()
          .duration(3000)
          .style("opacity", 1);

    // Add title label for pie chart 
    svg.append('text')
            .attr('x', 100)
            .attr('y',  height/2)
            .attr('text-anchor', 'middle')
            .style("font-weight", "bold")
            .style("font-size", 25)
            .style("fill", "white")
            .style("fill-opacity", 1)
            .style("stroke","black")
            .style("stroke-width", "1px")
            .style("stroke-linecap", "butt")
            .style("stroke-linejoin", "miter")
            .style("stroke-opacity", 1)
            .text('Genre Pie Chart');

    // Create a group to group the pie slices
    let g = svg.append('g')
                    .attr('transform', `translate(${margin+350}, ${margin+100})`);  

    // Used to generate the pie chart, when data is entered
    // each set is given a start and end angle to help with drawing.
    var pie = d3.pie();

    // Creates the actual arc or curve that we see. 
    // Note: changing the inner radius will change chart to a donut
    var arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius);

    // Create/append a new group for each genre in the pieChartData set
    var arcs = g.selectAll("arc")
                .data(pie(pieChartData))
                .enter()
                .append("g")
                .attr("class", "arc")

    // Add colour to each of the pie slices 
    arcs.append("path")
                .attr("fill", function(d, i) {
                    return color(i);
                })
                .attr("d", arc);
    
    // Adding genre labels to each slice in the pie
    d3.select('g').selectAll('g').append('text')
                .attr("transform", function(d){
                    d.innerRadius = 0;
                    d.outerRadius = radius;
                    return "translate(" + arc.centroid(d) + ")";
                })
                .attr("text-anchor", "middle")
                .style("font-size", 12)
                .text( function(d, i) {
                    return freqData[i].genre;
                });

    // Making a rectangle to act like a button, used for switching 
    // between graphs
    d3.select('#graphContainer').append("a")
        .append("rect")  
        .attr("id", "switchButton")
        .attr("x", 700)
        .attr("y", 250)
        .attr("height", 50)
        .attr("width", 100)
        .style("fill", "black")
        .attr("rx", 10)
        .attr("ry", 10);

    // Adding text to the rectangle button
    d3.select('#graphContainer').append("text")
        .attr("x", 750)
        .attr("y", 275)
        .style("fill", "white")
        .style("font-size", "20px")
        .attr("dy", ".35rem")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .text("Switch");
    
    // When #switchButton is clicked transition from pie chart 
    // to bar graph 
    var temp = d3.select('#switchButton');
    temp.on('click', function() {
        drawBarGraph(freqData, pieChartData);
    });
    
}

/**
 *  drawBarGraph(freqData, pieChartData) will draw the bar chart,
 *  and whenever the switch button is clicked, it will transition 
 *  back to pie chart
 * 
 * @param {*} freqData Bar chart data used to generate bar chart
 * @param {*} pieChartData pie chart data (used for button handler)
 */
function drawBarGraph(freqData, pieChartData){
    // Remove svg if it exist -> in the case of pie chart being active
    d3.select("#graphContainer").remove();
    
    // Find the maximum value in data set to set the upper limit
    // for colour scale and y scale
    var max = 0;
    for(let i = 0; i < freqData.length; i++){
        if(freqData[i].freq > max){
            max = freqData[i].freq;
        }
    }

    // Setting dimension constants
    const margin = 50;
    const width = 500;
    const height = 300;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;

    // Create a smooth linear colour scale mapping
    // the domain (0 to max frequency) and range (two colours)
    const colourScale = d3.scaleLinear()
                            .domain([0, max+0.1])
                            .range(['#f2f2f2', '#b3b3b3']);
    
    // Create x scale to be buckets, each bucket being one genre
    const xScale = d3.scaleBand()
                        .domain(freqData.map((data) => data.genre))
                        .range([0, chartWidth])
                        .padding(0.3);
    
    // Create y scale to be linear, since frequency can be continous
    const yScale = d3.scaleLinear()
                        .domain([0, max+0.1])
                        .range([chartHeight, 0]);

    // Create SVG container, set the attributes and append to table
    // Opacity is initially set to 0
    let svg = d3.select('#table-container')
                    .append('svg')
                        .attr('id', 'graphContainer')
                        .attr('width', width+300)
                        .attr('height', height)
                        .attr('display', 'block')
                        .attr('margin', 'auto')
                        .attr('transform', `translate(${0}, ${margin})`)
                        .style("opacity", 0);

    // Fade in the svg container by transitioning the opacity from 0 to 1
    // in 3 seconds
    d3.select("#graphContainer")
          .transition()
          .duration(3000)
          .style("opacity", 1);

    // Add title label for bar chart
    svg.append('text')
            .attr('x', width-90)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style("font-size", 25)
            .style("font-weight", "bold")
            .style("fill", "white")
            .style("fill-opacity", 1)
            .style("stroke","black")
            .style("stroke-width", "1px")
            .style("stroke-linecap", "butt")
            .style("stroke-linejoin", "miter")
            .style("stroke-opacity", 1)
            .text('Genre Vs Frequency');
    
    // Create a group and translate it. This group will contain all other
    // the axis, axis labels, and rectangles
    let g = svg.append('g')
                    .attr('transform', `translate(${margin+150}, ${margin})`)

    // Create vertical or y axis
    g.append('g')
        .call(d3.axisLeft(yScale))
    
    // Create y axis label and orient it correctly
    d3.select('g').append('text')
        .attr("text-anchor", "middle")
        .attr("transform", "translate("+ (-35) +","+(chartHeight/2)+")rotate(-90)")
        .text('Frequency(%)');

    // Create x axis label and oreint it correctly
    d3.select('g').append('text')
        .attr('class', 'xaxis')
        .attr("text-anchor", "middle")
        .attr("transform", "translate(0," + (chartHeight + margin) + ")") 
        .attr('x', chartWidth / 2)
        .text('Genre');
    
    // Create horizontal or x axis 
    g.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xScale));

    // Setting the width of each genre bar 
    d3.select('g').selectAll('rect')
        .data(freqData)
        .enter()
            .append('rect')
                .attr('x', (data) => xScale(data.genre))
                .attr('width', xScale.bandwidth())
                .attr('fill', (data) => colourScale(data.freq))

    // Setting the height or frequency of each genre bar
    d3.select('g').selectAll('rect')
        .transition()
            .attr('height', (data) => chartHeight - yScale(data.freq))
            .attr('y', (data) => yScale(data.freq))
            .attr('fill', (data) => colourScale(data.freq));

    
    // Making a rectangle to act like a button, used for switching 
    // between graphs
    d3.select('#graphContainer').append("a")
        .append("rect")  
        .attr("id", "switchButton")
        .attr("x", 700)
        .attr("y", 250)
        .attr("height", 50)
        .attr("width", 100)
        .style("fill", "black")
        .attr("rx", 10)
        .attr("ry", 10);

    // Adding text to the rectangle button
    d3.select('#graphContainer').append("text")
        .attr("x", 750)
        .attr("y", 275)
        .style("fill", "white")
        .style("font-size", "20px")
        .attr("dy", ".35rem")
        .attr("text-anchor", "middle")
        .style("pointer-events", "none")
        .text("Switch");

    // When #switchButton is clicked transition from bar graph
    // back to the pie chart
    var temp = d3.select('#switchButton');
    temp.on('click', function() {
        drawPieChart(freqData, pieChartData);
    });            
    
}

/**
 * StatsD3(props) renders in the statistics data into table contents 
 * when stats button is clicked
 * 
 * @param {*} props 
 * @returns -> New table content
 */
function StatsD3(props) {
    return (
        <div id="graph-container">
            {getGenreFrequency(props.tableData)}
        </div>
    );
}

export default StatsD3;