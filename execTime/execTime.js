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

var margin = { top: 20, right: 20, bottom: 60, left: 50 };

var mainwidth = (window.innerWidth - margin.left - margin.right),
	mainheight = (window.innerHeight*.6) - margin.top - margin.bottom;

var svg = d3.select(".mainviz").append("svg")
.attr("class","container")
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom);

var chartGroup = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select(".scroll__graphic").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position","absolute")
    .style("text-align","center")
    .style("background","whitesmoke")
    .style("padding","8px")
    .style("border-radius","8px")
    .style("pointer-events","none");

d3.tsv('https://gist.githubusercontent.com/Jasparr77/063eb94e3c46ed56f4bb373f53a37f34/raw/031aef537309e6ebb6f770f15c92c9e38a73f870/execTime.tsv',function(data){
    
    var parseTime= d3.timeParse("%H:%M:%S");

    data.forEach(function(d){
        d.duration = (
            (parseTime(d.time_end) - parseTime(d.time_start))
            /3600000
            ) ;
    })

    var nested_data = d3.nest()
    .key(function(d){return d.date})
    .key(function(d){return d.top_category})
    .rollup(function(leaves){
        return {
            duration: d3.sum(leaves, function(d){
                return d.duration;
            })}
    })
    .entries(data)

    var stackeData = d3.stack()
    .keys(['executive_time','meeting','lunch','travel','event'])

    stacked_data = stackeData(nested_data)

    console.log(data)
    console.log(nested_data)
    console.log(stacked_data)
// stack data, area chart by day for schedule. Exec Time in Orange, others in shades of blue? height == duration, x axis == date. ADD LEGEND, TOOLTIP

;})
