var margin = { top: 20, right: 20, bottom: 60, left: 50 };

var mainwidth = (window.innerWidth - margin.left - margin.right),
    mainheight = (window.innerHeight*.6) - margin.top - margin.bottom;

var w = mainwidth*.1, h = mainheight*.5;

var svg = d3.select(".mainviz").append("svg")
.attr("class","container")
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom);

var chartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select(".scroll__graphic").append("div")
    .attr("class","tooltip")
    .style("opacity","0")

var dropDown = d3.select(".scroll__graphic").append("select")
    .attr("id","dropdown")

var path = d3.geoPath();

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  d3.tsv('https://gist.githubusercontent.com/Jasparr77/80574e8c8409ca34a9fd29f33cfc6be5/raw/a1e1e6de6d13c2082c8711f069fa2c25c1031df0/minWage.tsv', function(data_raw){

    var svg = d3.select("#dropdown")
    .selectAll("option")
    .data(data_raw)
    .enter()
    .append("option")
    .attr("value", function(d) { return d['Year']; })
    .text(function(d) { return d['Year']; });

    var selected_year = "2017";

  var data = data_raw.filter(function(d){return d['Year'] === selected_year;})     
    console.log(data)
    var nested_data = d3.nest()
    .key(function(d){return d['State ID'].concat(d['State']);})
	.rollup(function(leaves){return {
        avgAt: d3.mean(leaves, function(d){return d['At Minimum Wage'] ;}),
		avgTotal: d3.mean(leaves, function(d){return d['Total'] ;}),
		avgBelow: d3.mean(leaves, function(d){return d['Below Minimum Wage'] ;})
	}})
	.entries(data)
    .map(function(d){return {id:d.key.substring(0,2),name:d.key.substring(2),Total:d.value.avgTotal, At: d.value.avgAt, Below: d.value.avgBelow
    };})

console.log(nested_data)

// join d3 & state data
us.objects.states.geometries.forEach(function(us) {
    var result = nested_data.filter(function(nest) {
        return nest.id === us.id;
    });
    us.name = (result[0] !== undefined) ? result[0].name : null  
    us.Total = (result[0] !== undefined) ? result[0].Total : null 
    us.At = (result[0] !== undefined) ? result[0].At : null
    us.Below = (result[0] !== undefined) ? result[0].Below : null
    ;
});

console.log(us)

// Legend work
var minVal = d3.min(nested_data,function(d){return d.Total;});
var maxVal = d3.max(nested_data,function(d){return d.Total;});

var lowColor = 'white'
var highColor = '#cc5500'

var ramp = d3.scaleLinear().domain([minVal,maxVal]).range([lowColor,highColor]);

var norm_fill = d3.scaleLinear().range([0,1]);


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
.attr("stop-color", highColor)
.attr("stop-opacity", 1);

legend.append("stop")
.attr("offset", "100%")
.attr("stop-color", lowColor)
.attr("stop-opacity", 1);

key.append("rect")
.attr("width", w)
.attr("height", h)
.style("fill", "url(#gradient)")
.attr("transform", "translate(0,10)")

var y = d3.scaleLinear()
.range([h, 0])
.domain([minVal, maxVal]);

var yAxis = d3.axisRight(y);

key.append("g")
.attr("class", "y axis")
.attr("transform", "translate("+ w +",10)")
.call(yAxis);
// End Legend Work

// State Bodies
var plot = d3.select(".container")
.append("g")
.attr("class", "states-bodies")
.selectAll("path")
.data(topojson.feature(us, us.objects.states).features)
.enter().append("path")
.attr("d", path)
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom)
.attr("transform","translate("+ w+ ")")
.data(us.objects.states.geometries)
.attr("fill",function(d) {// Get data value
	var value = d.Total;
	if (value) {//If value exists…
	return ramp(value);
	} else {//If value is undefined…
    return "#ffffff";
    }
})
.on("mouseover", function(d) {      
    div.transition()        
         .duration(200)      
       .style("opacity", .9);      
       div.html(
           d.name + "<br/>" 
           + d.Total.toLocaleString("en", {style: "percent"})
        )
       .style("left", (d3.event.pageX) + "px")     
       .style("top", (d3.event.pageY - 28) + "px");    
})   
// fade out tooltip on mouse out               
.on("mouseout", function() {       
    div.transition()        
       .duration(500)      
       .style("opacity", 0);   
})
.call(updateFill, selected_year);

// State Borders
svg.append("path")
.attr("class", "states-borders")
.attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })))
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom)
.attr("transform","translate("+ w+ ")")
.attr("stroke","whitesmoke")
.attr("stroke-width",".05vw")
.attr("fill","none");

// dropdown dataset selection
var dropDown = d3.select("#dropdown");

dropDown.on("change", function() {

    selected_year = d3.event.target.value;

    plot.call(updateFill, selected_year)
    console.log(selected_year)

});

// update fill based on dropdown choice
function updateFill(selection, selected_year) {

    var d_extent = d3.extent(selection.data(), function(d) {
        return parseFloat(d[selected_year]);
    });

    rescaleFill(selection, d_extent);
}

    function rescaleFill(selection, d_extent) {

        norm_fill.domain(d_extent)

        selection.transition()
                .duration(700)
                .attr("fill", function(d) {
                    var datum = parseFloat(d[selected_year]);
                    return ramp(norm_fill(datum));
                });
    }

})
})