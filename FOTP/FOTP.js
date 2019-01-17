var margin = { 
    top: window.innerHeight*.02, 
    right: window.innerWidth*.02, 
    bottom: window.innerHeight*.02, 
    left: window.innerWidth*.02 };

var mainwidth = (window.innerWidth - margin.left - margin.right),
	mainheight = (window.innerHeight*.6) - margin.top - margin.bottom;

var svg = d3.select(".mainviz").append("svg")
.attr("class","container")
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom);

var chartGroup = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
d3.csv('https://gist.githubusercontent.com/Jasparr77/0e278e24b4b8af013f2ba6d71ec0c979/raw/caa81ddddcf1c39a682af435817498ca5c719a0b/FOTP.csv').then(function(data){

var nested_data = d3.nest()
.key(function(d){return d.Country;})
.key(function(d){return d.Edition;}).sortKeys(d3.ascending)

.rollup(function(leaves){return {
    Total_Score: d3.sum(leaves, function(d){return d['Total Score'] ;}),
    Status: d3.max(leaves, function(d){return d.Status ;})
}})
.entries(data)
console.log(nested_data)
	// .map(function(d){return {Country:d.key, Entry: d.value.key, totalScore:d.value.Total_Score, Status:d.value.Status};})
// console.log(data)
// console.log(nested_data)

var y = d3.scaleLinear()
.domain([0,100])
.range([mainheight, 0]);

var x = d3.scaleBand()
.domain(data.map(function(d){ return d.Edition;}))
.range([0, mainwidth])
.paddingInner(.05)

var yAxis = d3.axisLeft(y);

var xAxis = d3.axisBottom(x);

var line = d3.line()
    .x(function(nested_data) { return x(nested_data.Edition); })
    .y(function(d) { return y(+d.Total_Score) })
    .curve(d3.curveNatural);

var countries = chartGroup.selectAll(".countries")
    .data(nested_data)
    .enter()
    .append("g")

var paths = countries.selectAll(".line")
    .data(function(d){
        return d.values.Total_Score
    } )
    .enter()
    .append("path");

chartGroup.append("g")
.attr("class","axis y")
.call(yAxis)

chartGroup.append("g")
.attr("class","axis x")
.attr("transform","translate(0,"+mainheight+")")
.call(xAxis)

chartGroup.selectAll(".line")
    .data(nested_data)
    .enter()
    .append("path")
        .attr("class","line")
        .attr("d", function(d){
            return line(d.values)
        })

;})