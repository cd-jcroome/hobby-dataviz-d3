

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

var projection = d3.geoAlbersUsa()
                    .attr("transform","translate(" + margin.left + "," + margin.top + ")");

d3.tsv('https://gist.githubusercontent.com/Jasparr77/80574e8c8409ca34a9fd29f33cfc6be5/raw/f32645bbd5f7ed1faeed2fcb3f9c1b837200ec8a/minWage.tsv').then(function(data){
console.log(data);})