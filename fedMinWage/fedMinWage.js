

var margin = { top: 20, right: 20, bottom: 60, left: 50 };

var mainwidth = (window.innerWidth - margin.left - margin.right),
	mainheight = (window.innerHeight*.6) - margin.top - margin.bottom;

var svg = d3.select(".mainviz").append("svg")
.attr("class","container")
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom);

var chartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv('https://gist.githubusercontent.com/Jasparr77/80574e8c8409ca34a9fd29f33cfc6be5/raw/f32645bbd5f7ed1faeed2fcb3f9c1b837200ec8a/minWage.tsv').then(function(data){
console.log(data)

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path);

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));

var minVal = d3.min(data,function(d){return d.Total;});
var maxVal = d3.max(data,function(d){return d.Total;});

var lowColor = '#ffffff'
var highColor = '#cc5500'

var colorScale = d3.scaleSequential(d3.interpolateOranges)
.domain([minVal, maxVal]);


// Legend work
var w = 140, h = 300;

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

})})