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

d3.tsv('https://gist.githubusercontent.com/Jasparr77/063eb94e3c46ed56f4bb373f53a37f34/raw/f9bc083b0d6711b0877621abecfca5b1c01ecc81/execTime.tsv',function(data){
    
    var zKeys = [];

    data.forEach(function(d)
    {
        if(zKeys.indexOf(d.detail_category) === -1) {
            zKeys.push(d.detail_category);
            // console.log(zKeys)
        }
    });

    console.log(zKeys)
    
    var parseTime= d3.timeParse("%H:%M:%S");

    data.forEach(function(d){
        d.duration = (
            (parseTime(d.time_end) - parseTime(d.time_start))
            /3600000
            ) ;
    })

    var nested_data = d3.nest()
    .key(function(d){return d.date})
    .key(function(d){return d.detail_category})
    .rollup(function(leaves){
        return d3.sum(leaves, function(d){return d.duration; })
    })
    .entries(data)
    // console.log("after initial nesting",nested_data)

    // var zKeys = ['orange':'executive_time','grey':'travel','lightblue':'event','darkblue':'meeting','teal':'lunch','whitesmoke':'no_data']
    // var zKeys = Array.from(data.date)

//BEGIN data cleanup for d3.stack
//Add default values for missing data points to make each array formatted the same
nested_data = nested_data.map(function(keyObj) {
    return {
        key: keyObj.key,
        values: zKeys.map(function(k) { 
                duration = keyObj.values.filter(function(v) { return v.key == k; })[0];
                return duration || ({key: k, duration: 0});
        })
    };
});
// console.log("after cleanup 1",nested_data)
//Loop through the nested array and create a new array element that converts each individual nested element into a key/value pair in a single object.
var flat_data = [];
nested_data.forEach(function(d) {
var obj = { date: d.key }
    d.values.forEach(function(f) {
        obj[f.key] = f.value || 0;
    });
flat_data.push(obj);
});
// console.log("now it's flat",flat_data)
//END data cleanup for d3.stack

    var y = d3.scaleLinear()
    .domain([0,24])
    .range([mainheight, 0])

    var x = d3.scaleBand()
    .domain(data.map(function(d){ return d.date;}))
    .range([0, mainwidth])

    var yAxis = d3.axisLeft(y);

    var xAxis = d3.axisBottom(x);

    chartGroup.append("g")
    .selectAll("g")
    .data(d3.stack().keys(zKeys)(flat_data))
    .enter().append("g")
      .attr("fill", "black")
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.data.date); })
      .attr("y", function(d) { return y(d[1]); })
      .attr("height", function(d) { return y(d[0]) - y(d[1]); })
      .attr("width", x.bandwidth());

    chartGroup.append("g")
    .attr("class","axis y")
    .call(yAxis)

    chartGroup.append("g")
    .attr("class","axis x")
    .attr("transform","translate(0,"+mainheight+")")
    .call(xAxis)

    var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");




// stack data, area chart by day for schedule. Exec Time in Orange, others in shades of blue? height == duration, x axis == date. ADD LEGEND, TOOLTIP

;})
