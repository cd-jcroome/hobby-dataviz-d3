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

var path = d3.geoPath();

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  d3.tsv('https://gist.githubusercontent.com/Jasparr77/80574e8c8409ca34a9fd29f33cfc6be5/raw/a1e1e6de6d13c2082c8711f069fa2c25c1031df0/minWage.tsv', function(data){
    console.log(data)
    var nested_data = d3.nest()
    .key(function(d){return d.State;})
    .key(function(d){return d['State ID']})
	.rollup(function(leaves){return {
        // ID: leaves['State ID'],
		avgAt: d3.mean(leaves, function(d){return d['At Minimum Wage'] ;}),
		avgBelow: d3.mean(leaves, function(d){return d['Below Minimum Wage'] ;})
	}})
	.entries(data)
    // .map(function(d){return {State:d.key, ID:d.key, 
    //     At:d.values[0].value.avgAt, Below:d.values[0].values.avgBelow
    // };})
  
  
  console.log(nested_data)

var joined_data = join(nested_data, us, nested_data.ID, us.objects.states.geometries.id, function(nest, us) {
    return {
        // ID : nest.id,
        name : nest.State,
        At : nest.At,
        Below : nest.Below,
        draw : us.objects.states.geometries,
    };
});
console.log(joined_data)
// Loop through each state data value in the .csv file

console.log(us)

var minVal = d3.min(data,function(d){return d.Total;});
var maxVal = d3.max(data,function(d){return d.Total;});

var lowColor = '#ffffff'
var highColor = '#cc5500'

var colorScale = d3.scaleSequential(d3.interpolateOranges)
.domain([minVal, maxVal]);

// Legend work
    var w = mainwidth*.15, h = mainheight*.33;

    var key = d3.select(".container")
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "legend");

    var legend = key.append("defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", "100%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    legend.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", lowColor)
        .attr("stop-opacity", 1);
        
    legend.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", highColor)
        .attr("stop-opacity", 1);

    key.append("rect")
        .attr("width", w - 100)
        .attr("height", h)
        .style("fill", "url(#gradient)")
        .attr("transform", "translate(0,10)")

    var y = d3.scaleLinear()
        .range([h, 0])
        .domain([minVal, maxVal]);

    var yAxis = d3.axisRight(y);

    key.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(41,10)")
        .call(yAxis);
// End Legend Work

d3.select(".container")
.append("g")
.attr("class", "states-bodies")
.selectAll("path")
.data(topojson.feature(us, us.objects.states).features)
.enter().append("path")
.attr("d", path)
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom)
.attr("transform","translate("+ w+ ")")
.attr("fill","orange");

svg.append("path")
.attr("class", "states-borders")
.attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom)
.attr("transform","translate("+ w+ ")")
.attr("stroke","whitesmoke")
.attr("stroke-width",".1vw")
.attr("fill","none");


})
})