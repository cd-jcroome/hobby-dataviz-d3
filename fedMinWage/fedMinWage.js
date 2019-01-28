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
    .key(function(d){return d['State ID'];})
	.rollup(function(leaves){return {
		avgAt: d3.mean(leaves, function(d){return d['At Minimum Wage'] ;}),
		avgBelow: d3.mean(leaves, function(d){return d['Below Minimum Wage'] ;})
	}})
	.entries(data)
    .map(function(d){return {ID:d.key, At:d.value.avgAt, Below: d.value.avgBelow};})
//   console.log(nested_data)

// Loop through each state data value in the .csv file
us.objects.states.geometries.forEach(function(us) {
    var result = nested_data.filter(function(nest) {
        return nest.ID === us.id;
    });
    us.At = (result[0] !== undefined) ? result[0].At : null
    us.Below = (result[0] !== undefined) ? result[0].Below : null
    ;
});

// // Loop through each state data value in the .csv file
// for (var i = 0; i < nested_data.length; i++) {

// 	// Grab State Name
// 	var dataState = nested_data[i].ID;

// 	// Grab data value 
// 	var dataAt = data[i].At;
//     var dataBelow = data[i].Below;
// 	// Find the corresponding state inside the GeoJSON
// 	for (var j = 0; j < us.features.length; j++)  {
// 		var jsonState = us.features[j].properties.name;

// 		if (dataState == jsonState) {

// 		// Copy the data value into the JSON
//         us.features[j].properties.at = dataAt;
//         us.features[j].propoerties.below = dataBelow; 

// 		// Stop looking through the JSON
// 		break;
// 		}
// 	}
// }


console.log(us)

var minVal = d3.min(data,function(d){return d.Total;});
var maxVal = d3.max(data,function(d){return d.Total;});

var highColor = '#ffffff'
var lowColor = '#cc5500'

var colorScale = d3.scaleSequential(d3.interpolateOranges)
.domain([minVal, maxVal]);

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
// .attr("fill","orange")
.data(us)
.attr("fill",function(d) {// Get data value
	var value = d.objects.states.geometries.At;
	if (value) {//If value exists…
	return colorScale(value);
	} else {//If value is undefined…
	return "#ffffff";
	}
});

svg.append("path")
.attr("class", "states-borders")
.attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom)
.attr("transform","translate("+ w+ ")")
.attr("stroke","whitesmoke")
.attr("stroke-width",".1vw")
.attr("fill","none");

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
})
})