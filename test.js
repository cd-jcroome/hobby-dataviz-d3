const scroller = scrollama();
function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    return output;
};

var parseTime = d3.timeParse("%d/%m/%Y");

data.sort(function(d,f){
    return d3.ascending(d.__,f.__)
})

var margin = { top: 20, right: 20, bottom: 60, left: 50 };

var mainwidth = (window.innerWidth - margin.left - margin.right),
	mainheight = (window.innerHeight*.6) - margin.top - margin.bottom;

var svg = d3.select(".mainviz").append("svg")
.attr("class","container")
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom);

var chartGroup = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

graphic.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position","absolute")
    .style("text-align","center")
    .style("background","whitesmoke")
    .style("padding","8px")
    .style("border-radius","8px")
    .style("pointer-events","none");

var tooltip = d3.select(".tooltip")

d3.tsv('',function(data){
console.log(data);

var div = d3.select(".scroll__text")
    .append("div")
        .attr("class", "step")
        .attr("y",mainheight)
        .attr("data-step", "a")
        .html("<h2>check check</h2>")

var div = d3.select(".scroll__text")
    .append("div")
        .attr("class", "step")
        .attr("y",mainheight*2)
        .attr("data-step", "b")
        .html("<h2>One-two</h2>")

var div = d3.select(".scroll__text")
    .append("div")
        .attr("class", "step")
        .attr("y",mainheight*3)
        .attr("data-step", "c")
        .html("<h2>this thing on?</h2>")
})