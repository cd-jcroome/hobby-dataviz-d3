var container = d3.select('#staticBody')

var margin = { top: (window.innerWidth*.14), right: 80, bottom: 60, left: 80 };

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
var chartGroup = d3.select(".chart");

function handleResize() {
    var bodyWidth = (Math.floor(window.innerWidth*.95));
    var bodyHeight = (Math.floor(window.innerHeight*.80))
        
    minDim = Math.min(bodyWidth, bodyHeight)

    yRange = minDim
    xRange = minDim

    var chartMargin = 5;
    chartWidth = xRange-chartMargin;

    chartGroup
        .style('width', chartWidth + 'px')
        .style('height', bodyHeight + 'px');
}
d3.csv('https://cdn.jsdelivr.net/gh/jasparr77/hobby-dataviz-d3/songShape/output/SevenNationArmy.csv', function(data){
    handleResize()

    var x = d3.scaleLinear()
            .domain([-9,9])
            .range([0,xRange]);

    var y = d3.scaleLinear()
            .domain([-9,9])
            .range([yRange,0]);

    var songPath = d3.line()
        .curve(d3.curveNatural)
        .x(function(d){return x(d.value['x'])})
        .y(function(d){return y(d.value['y'])});

    var color = d3.scaleOrdinal(d3.schemeCategory10)

    let octaves = [1,2,3,4,5,6,7,8];
    
    var pointData = d3.nest()
        .key(function(d){return d['']})
        .rollup(function(leaves){
            return {
                x: d3.sum(leaves, function(d){return Math.sin(d['angle'])*d['octave']}), // x coordinate for note
                y: d3.sum(leaves, function(d){return Math.cos(d['angle'])*d['octave']}), // y coordinate for note
                channel: d3.max(leaves, function(d){return Number(d['channel'])}),
                time: d3.max(leaves, function(d){return Number(d['note_seconds'])})
            }
        })
        .entries(data)

    var lineData = d3.nest()
    .key(function(d){return d['channel']})
    .key(function(d){return d['']})
    .rollup(function(leaves){
        return {
            x: d3.sum(leaves, function(d){return Math.sin(d['angle'])*d['octave']}), // x coordinate for note
            y: d3.sum(leaves, function(d){return Math.cos(d['angle'])*d['octave']}), // y coordinate for note
            channel: d3.max(leaves, function(d){return Number(d['channel'])}),
            time: d3.max(leaves, function(d){return Number(d['note_seconds'])})
        }
    })
    .entries(data)

        console.log(pointData)
        console.log(lineData)

    lastRecord = data.length-1

    chartGroup.selectAll(".circleFifths")
        .data(data)
        .enter().append("circle")
        .attr("class","circleFifths")
        .attr("cx",x(0))
        .attr("cy",y(0))
        .attr("r",function(d){return y(Number(d['octave']))})
        .attr("fill","none")
        .attr("stroke","darkgrey")
        .attr("opacity",.7)
        .attr("stroke-width",".02vw");  

    chartGroup.selectAll(".line")
        .data(lineData)
        .enter()
        .append("path")
        .attr("class",function(d){return d['key']+" songPath"})
        .attr("d",function(d) {return songPath(d.values);})
        .attr("fill",function(d){return color(Number(d['key']))})
        .attr("fill-opacity",.2)
        .attr("stroke",function(d){return color(Number(d['key']))})
        .attr("stroke-opacity",.4)
        .attr("stroke-width",".01vw");

    chartGroup.selectAll(".noteCircle").data(pointData)
        .enter()
        .append("circle")
        .attr("class","noteCircle")
        .attr("cx",function(d){return x(d.value['x']); })
        .attr("cy",function(d){return y(d.value['y']); })
        .attr("r",".3vw")
        .attr("fill",function(d){return color(d.value['channel']); })
        .attr("fill-opacity","0")
        .attr("stroke","none")
        .transition()
            .delay(function(d){return (d.value['time'])*500; })
            .attr("fill-opacity",.6)
            .attr("stroke","white")
            .attr("stroke-width",".04vw")
            .attr("r",".6vw")
        .transition()
            .attr("fill-opacity","0")
            .attr("stroke","none")
            .attr("r",".2vw")

})
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle