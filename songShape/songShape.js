var container = d3.select('#staticBody')

var margin = { top: (window.innerWidth*.14), right: 80, bottom: 60, left: 80 };

var nestData = []
var dict = []

container.append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position","absolute")
    .style("text-align","center")
    .style("background","whitesmoke")
    .style("padding","8px")
    .style("border-radius","8px")
    .style("pointer-events","none")
    .style("z-index","9999");

container.append('svg').attr('class','chart');

var tooltip = d3.select(".tooltip");
var formHolder = d3.select("#formholder");
var chartGroup = d3.select(".chart")

function handleResize() {
    var bodyWidth = (Math.floor(window.innerWidth*.95));
    yRange = 600
    xRange = 600


    var chartMargin = 5;
    var chartWidth = xRange-chartMargin;

    chartGroup
        .style('width', chartWidth + 'px')
        .style('height', Math.floor(window.innerHeight*.80) + 'px');
}
d3.csv('https://raw.githubusercontent.com/Jasparr77/hobby-dataviz-d3/master/songShape/output/mary.csv', function(data){
    function onlyNotes(check){
        return check = " Note_on_c";
    }    
    // data = data.filter(data['2'].filter(onlyNotes))
    console.log(data)

    handleResize()
    var x = d3.scaleLinear()
            .domain([-(d3.max(data, function(d){return d['octave'];})),(d3.max(data, function(d){return d['octave'];}))])
            .range([0,xRange]);

    var y = d3.scaleLinear()
            .domain([-(d3.max(data, function(d){return d['octave'];})),(d3.max(data, function(d){return d['octave'];}))])
            .range([yRange,0]);

    function plotX(radians, radius){
        return Math.sin(radians)*radius
    }
    function plotY(radians,radius){
        return Math.cos(radians)*radius
    }

    var songPath = d3.line()
        .curve(d3.curveCardinal.tension(0))
        .x(function(d){return x(plotX(d['angle'],d['octave']))})
        .y(function(d){return y(plotY(d['angle'],d['octave']))})
    
    chartGroup.selectAll(".circleFifths")
        .data(data)
        .enter().append("circle")
        .attr("class",function(d){return "circleFifths"+" "+d['octave']})
        .attr("cx",x(0))
        .attr("cy",y(0))
        .attr("r",function(d){return y(d['octave'])})
        .attr("fill","none")
        .attr("stroke","lightgrey")   

    chartGroup.append("path")
        .attr("class","songPath")
        .attr("d",songPath(data))
        .attr("fill","lightgrey")
        .attr("stroke","black")
        .attr("stroke-width",".1vw")
    
    var path = chartGroup.select(".songPath")

    var totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(4000)
        .ease(d3.easeCircleInOut)
        .attr("stroke-dashoffset", 0)

    chartGroup.selectAll(".noteCircle")
        .data(data)
        .enter().append("circle")
        .attr("class",function(d){return "noteCircle"+" "+d['note_name']+"_"+d['octave']})
        .attr("cx",function(d){return x(plotX(d['angle'],d['octave']))})
        .attr("cy",function(d){return y(plotY(d['angle'],d['octave']))})
        .attr("r",".2vw")
        .attr("fill","whitesmoke")
        .transition()
        .delay(function(d,i){return (i/81)*20000;})
        .attr("fill",'steelblue')

})
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle