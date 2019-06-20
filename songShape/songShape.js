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
d3.json('https://raw.githubusercontent.com/Jasparr77/hobby-dataviz-d3/master/songShape/output/Slayer_-_Expendable_youth.json', function(data){
    console.log(data)
    noteData = data.note_on.filter(function(d){
        if (d.note_velocity > 0) {
            return true
        } else {
            return false;
        }
    })
    lastRecord = noteData.length-1
    console.log(noteData[lastRecord])

    handleResize()
    var x = d3.scaleLinear()
            .domain([-9,9])
            .range([0,xRange]);

    var y = d3.scaleLinear()
            .domain([-9,9])
            .range([yRange,0]);

    function plotX(radians, radius){
        return Math.sin(radians)*radius
    }
    function plotY(radians, radius){
        return Math.cos(radians)*radius
    }

    var songPath = d3.line()
        .curve(d3.curveCardinalClosed.tension(0.7))
        .x(function(d){return x(plotX(d['angle'],(d['octave'])))})
        .y(function(d){return y(plotY(d['angle'],(d['octave'])))})
    
    chartGroup.selectAll(".circleFifths")
        .data([1,2,3,4,5,6,7,8,9])
        .enter().append("circle")
        .attr("class",function(d){return "circleFifths"+" "+d})
        .attr("cx",x(0))
        .attr("cy",y(0))
        .attr("r",function(d){return y((d))})
        .attr("fill","none")
        .attr("stroke","lightgrey")
        .attr("opacity",.7)
        .attr("stroke-width",".2vw")   

    chartGroup.selectAll(".line")
    .data(noteData)
    .enter()
        .append("path")
        .attr("class",function(d){return d.channel+" line songPath"})
        .attr("d",songPath(noteData))
        .attr("fill","none")
        .attr("stroke","grey")
        .attr("stroke-width",".1vw")
    
    // var path = chartGroup.select(".songPath")

    // var totalLength = path.node().getTotalLength();

    // path
    //     .attr("stroke-dasharray", totalLength + " " + totalLength)
    //     .attr("stroke-dashoffset", totalLength)
    //     .transition()
    //     .duration((noteData[lastRecord].note_seconds)*100)
    //     .ease(d3.easeBackIn)
    //     .attr("stroke-dashoffset", 0)
    

    chartGroup.selectAll(".noteCircle")
        .data(noteData)
        .enter().append("circle")
        .attr("class",function(d){return "noteCircle"+" "+d['note_name']+"_"+d['octave']})
        .attr("cx",function(d){return x(plotX(d['angle'],(d['octave'])))})
        .attr("cy",function(d){return y(plotY(d['angle'],(d['octave'])))})
        .attr("r",".2vw")
        .attr("fill","salmon")
        // .attr("opacity",0)
        // .transition()
        // .delay(function(d){return d.note_seconds*1000;})
        .attr("opacity",.8)

})
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle