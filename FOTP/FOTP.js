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

var div = d3.select(".scroll__graphic").append("div").attr("class", "tooltip").style("opacity", 0).style("position","absolute").style("text-align","center").style("background","whitesmoke").style("padding","8px").style("border-radius","8px").style("pointer-events","none");
    
d3.csv('https://gist.githubusercontent.com/Jasparr77/0e278e24b4b8af013f2ba6d71ec0c979/raw/74e69a442eb4a2cdaf3152f63b91a54d7e83ceb0/FOTP.csv', function(data){

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
.domain([0,105])
.range([mainheight, 0]);

var x = d3.scaleBand()
.domain(sortData.map(function(d){ return d.sortEdition;}))
.range([0, mainwidth])
.paddingInner(.05)

var color = d3.scaleSequential(d3.interpolateMagma)
.domain([0,5])

var yAxis = d3.axisLeft(y);

var xAxis = d3.axisBottom(x);

var line = d3.line()
    .x(function(nested_data) { return x(nested_data.Edition); })
    .y(function(d) { return y(100-d['Total Score']); })
    .curve(d3.curveNatural);

var linearGradient = svg.append("defs")
    .append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("gradientTransform", "rotate(90)");

linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", color(1));

linearGradient.append("stop")
    .attr("offset", "25%")
    .attr("stop-color", color(2));

linearGradient.append("stop")
    .attr("offset", "50%")
    .attr("stop-color", color(3));

linearGradient.append("stop")
    .attr("offset", "75%")
    .attr("stop-color", color(4));

linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", color(5));

chartGroup.selectAll(".line")
    .data(nested_data)
    .enter()
    .append("path")
        .attr("class","countryLine")
        .attr("d", function(d){
            return line(d.values);
        })
		.attr("fill","none")
        .attr("stroke","url(#linear-gradient")
        .attr("stroke-width", ".1vw")
        .attr("opacity",".5")
        .on("mouseover", function(d) {
            d3.select(this)
            .attr("id","selectedPath")
            .attr("stroke-width","1vw")
            .attr("opacity","100%");
            div.transition().duration(200).style("opacity", .9);
            div.html(d.key)
            .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
          })
        .on("mouseout", function() {
          d3.select(this)
          .attr("id","selectedPath")
          .attr("stroke-width",".1vw")
          .attr("opacity",".5"),
          div.transition().duration(500).style("opacity", 0);
          });

chartGroup.append("g")
.attr("class","axis y")
.call(yAxis)

chartGroup.append("g")
.attr("class","axis x")
.attr("transform","translate(0,"+mainheight+")")
.call(xAxis)



    ;})