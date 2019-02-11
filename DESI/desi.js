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

var div = d3.select(".scroll__graphic").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position","absolute")
    .style("text-align","center")
    .style("background","whitesmoke")
    .style("padding","8px")
    .style("border-radius","none")
    .style("pointer-events","none");

d3.tsv('https://gist.githubusercontent.com/Jasparr77/673faca63682a4c8788025ac021a46df/raw/9525eccf53d6a5c1248c9ff0cf925eb29040d5c1/desi.tsv',function(data){
    
    var parseYear = d3.timeParse("%Y");
    var formatYear = d3.timeFormat("%Y");

    data.forEach(function(d){
        d.Year = formatYear(
            parseYear(d.Year)
        );
    })

    var nested_data = d3.nest()
    .key(function(d){return d.Country;})
    .key(function(d){return d.Year;})
    .rollup(function(leaves){return {
        total_desi: d3.sum(leaves, function(d){return d['Weighted Score'];})
	}})
    .entries(data)
    console.log(data)
    console.log(nested_data)

;})