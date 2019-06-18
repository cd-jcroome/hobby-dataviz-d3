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
d3.json('https://raw.githubusercontent.com/Jasparr77/hobby-dataviz-d3/master/songShape/output/mary.json', function(data){
    console.log(data)
    // noteData = data[2].filter(
    //     function(d){
    //         return (
    //             d.event_desc = "Note_on_c" ?
    //             d.note_veloctiy >0 ? // check the typo!
    //                     true : false
    //                 : false
    //         )
    //     }
    // )
    // function onlyNotes(check){
    //     return check = "Note_on_c";
    // }    
    // console.log(noteData)

    handleResize()
    var x = d3.scaleLinear()
            .domain([-8,8])
            .range([0,xRange]);

    var y = d3.scaleLinear()
            .domain([-8,8])
            .range([yRange,0]);

    function plotX(radians, radius){
        return Math.sin(radians)*radius
    }
    function plotY(radians, radius){
        return Math.cos(radians)*radius
    }

    var songPath = d3.line()
        .curve(d3.curveCardinalClosed.tension(0.7))
        .x(function(d){return x(plotX(d['angle'],(d['octave']+1)))})
        .y(function(d){return y(plotY(d['angle'],(d['octave']+1)))})
    
    chartGroup.selectAll(".circleFifths")
        .data([0,1,2,3,4,5,6,7,8,9])
        .enter().append("circle")
        .attr("class",function(d){return "circleFifths"+" "+d})
        .attr("cx",x(0))
        .attr("cy",y(0))
        .attr("r",function(d){return y((d))})
        .attr("fill","none")
        .attr("stroke","lightgrey")
        .attr("stroke-width",".2vw")   

    chartGroup.append("path")
        .attr("class","songPath")
        .attr("d",songPath(noteData))
        .attr("fill","salmon")
        .attr("opacity",.25)
        .attr("stroke","whitesmoke")
        .attr("stroke-width",".1vw")
    
    var path = chartGroup.select(".songPath")

    var totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(16000)
        .ease(d3.easeCircleInOut)
        .attr("stroke-dashoffset", 0)

    chartGroup.selectAll(".noteCircle")
        .data(noteData)
        .enter().append("circle")
        .attr("class",function(d){return "noteCircle"+" "+d['note_name']+"_"+d['octave']})
        .attr("cx",function(d){return x(plotX(d['angle'],(d['octave']+1)))})
        .attr("cy",function(d){return y(plotY(d['angle'],(d['octave']+1)))})
        .attr("r",".2vw")
        .attr("fill","whitesmoke")
        .transition()
        .delay(function(d,i){return (i/81)*1000;})
        .attr("fill",'steelblue')

})
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle