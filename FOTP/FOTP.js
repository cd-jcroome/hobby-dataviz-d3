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

// data.sort(function(d) {return d3.ascending(d.Edition);})

console.log(data)

var y = d3.scaleLinear()
.domain([0,100])
.range([mainheight, 0]);

var x = d3.scaleBand()
.domain(data.map(function(d){ return d.Edition;}))
.range([0, mainwidth])
.paddingInner(.05)

var yAxis = d3.axisLeft(y);

var xAxis = d3.axisBottom(x);

chartGroup.append("g")
.attr("class","axis y")
.call(yAxis)

chartGroup.append("g")
.attr("class","axis x")
.attr("transform","translate(0,"+mainheight+")")
.call(xAxis)

;})