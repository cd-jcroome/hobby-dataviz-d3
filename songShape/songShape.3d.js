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
    yRange = 600
    xRange = 1200

    var chartMargin = 5;
    chartWidth = xRange-chartMargin;

    chartGroup
        .style('width', chartWidth + 'px')
        .style('height', Math.floor(window.innerHeight*.80) + 'px');
}
d3.csv('https://cdn.jsdelivr.net/gh/jasparr77/hobby-dataviz-d3/songShape/output/Hallelujah.csv', function(data){
    handleResize()

    var pointData = d3.nest()
        .key(function(d){return d['']})
        .rollup(function(leaves){
            return {
                x: d3.sum(leaves, function(d){return Math.sin(d['angle']*5)}), // x coordinate for note
                y: d3.sum(leaves, function(d){return Math.cos(d['angle']*5)}), // y coordinate for note
                z: d3.sum(leaves, function(d){return Number(d['octave']);}),    // z coordinate for octave
                channel: d3.max(leaves, function(d){return Number(d['channel'])})
            }
        })
        .entries(data)

    chartGroup.call(d3.drag().on('drag', dragged).on('start', dragStart).on('end', dragEnd)).append('g');

    var color = d3.scaleOrdinal(d3.schemeCategory20), beta = 0, alpha = 0, startAngle = 45, origin = [(chartWidth/2),300], scale = 20, centerLine = [];
    var mx, my, mouseX, mouseY;
    
    var point3d = d3._3d()
        .x(function(d){return d.value['x']*4; })
        .y(function(d){return d.value['y']*4; })
        .z(function(d){return d.value['z']*3; })
        .scale(scale)
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .shape('POINT');

    var centerLine3d = d3._3d()
        .shape('LINE_STRIP')
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(scale);

    var songPath3d = d3._3d()
        .shape('LINE_STRIP')
        .origin(origin)
        .rotateY(startAngle)
        .rotateX(-startAngle)
        .scale(scale);

    function plotPointData(data,tt){
        var points = chartGroup.selectAll('circle').data(data[0]);

        points
            .enter()
            .append('circle')
            .attr('class','_3d points')
            .attr('opacity',0)
            .attr('cx',posPointX)
            .attr('cy',posPointY)
            .merge(points)
            .transition().duration(tt)
            .attr('r','5px')
            .attr('fill',function(d){return d3.color(color(d.value['channel'])).darker(-1);})
            .attr('stroke',function(d){return color(d.value['channel']);})
            .attr('stroke-width','.25px')
            .attr('opacity',.8)
            .attr('cx',posPointX)
            .attr('cy',posPointY);

        points.exit().remove();

        var line = chartGroup.selectAll('path').data(data[1]);

        line
            .enter()
            .append('path')
            .attr('class','_3d centerLine')
            .merge(line)
            .attr('stroke','grey')
            .attr('stroke-width','1px')
            .attr('d',centerLine3d.draw);

        line.exit().remove();

        // var songPath = chartGroup.selectAll('path').data(data[2]);

        // songPath
        //     .enter()
        //     .append('path')
        //     .attr('class','_3d songPath')
        //     .merge(line)
        //     .attr('stroke',function(d){return color(d.value['channel']);})
        //     .attr('stroke-width','2px')
        //     .attr('d',songPath3d.draw);

        // songPath.exit().remove();

        d3.selectAll('._3d').sort(d3._3d().sort);
    }

    function posPointX(d){
        return d.projected.x;
    }

    function posPointY(d){
        return d.projected.y;
    }

    function init(){
        centerLine = []
        d3.range(0, 24, 1).forEach(function(d){ centerLine.push([0,0,d]); });
        var data = [
            point3d(pointData),
            centerLine3d([centerLine])
            // songPath3d([pointData])
        ]
        plotPointData(data,1000)
    }

    function dragStart(){
        mx = d3.event.x;
        my = d3.event.y;
    }

    function dragged(){
        mouseX = mouseX || 0;
        mouseY = mouseY || 0;
        beta = (d3.event.x - mx + mouseX) * Math.PI / 230;
        alpha = (d3.event.y - my + mouseY) * Math.PI / 230;
        var data = [
            point3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)(pointData),
            centerLine3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([centerLine])
            // songPath3d.rotateY(beta + startAngle).rotateX(alpha - startAngle)([pointData])
        ]
        plotPointData(data,0)
    }

    function dragEnd(){
        mouseX = d3.event.x - mx + mouseX;
        mouseY = d3.event.y - my + mouseY;
    }
    init()

})
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle