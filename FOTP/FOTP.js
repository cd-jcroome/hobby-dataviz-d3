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
    
d3.csv('https://gist.githubusercontent.com/Jasparr77/0e278e24b4b8af013f2ba6d71ec0c979/raw/74e69a442eb4a2cdaf3152f63b91a54d7e83ceb0/FOTP.csv').then(function(data){

var sortData = data.sort(function(d){
    return d3.ascending(d.Edition);
});

var parseYear = d3.timeParse("%Y");
var formatYear = d3.timeFormat("%Y");

data.forEach(function(d){
    d.sortEdition = formatYear(
        parseYear(d.Edition)
    );
})

var nested_data = d3.nest()
.key(function(d){return d.Country;})
.entries(sortData)
console.log(nested_data)


var y = d3.scaleLinear()
.domain([0,100])
.range([mainheight, 0]);

var x = d3.scaleBand()
.domain(sortData.map(function(d){ return d.sortEdition;}))
.range([0, mainwidth])
.paddingInner(.05)

var yAxis = d3.axisLeft(y);

var xAxis = d3.axisBottom(x);

var line = d3.line()
    .x(function(nested_data) { return x(nested_data.Edition); })
    .y(function(d) { return y(+d['Total Score']); })
    .curve(d3.curveNatural);

// var countries = chartGroup.selectAll(".countries")
//     .data(nested_data)
//     .enter()
//     .append("g")

chartGroup.selectAll(".line")
    .data(nested_data)
    .enter()
    .append("path")
        .attr("class","countryLine")
        .attr("d", function(d){
            return line(d.values);
        })
		.attr("fill","none")
		.attr("stroke","black")
		.attr("stroke-width", ".05vw")

chartGroup.append("g")
.attr("class","axis y")
.call(yAxis)

chartGroup.append("g")
.attr("class","axis x")
.attr("transform","translate(0,"+mainheight+")")
.call(xAxis)



    ;})