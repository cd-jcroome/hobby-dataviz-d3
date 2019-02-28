var margin = { top: 20, right: 20, bottom: 60, left: 30 };

var mainwidth = (window.innerWidth - margin.left - margin.right),
	mainheight = (window.innerHeight*.6) - margin.top - margin.bottom;

var color = d3.scaleOrdinal().range(['orange','steelblue','grey','lightgrey','lightblue','whitesmoke'])

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
    .style("border-radius","8px")
    .style("pointer-events","none");

var legend = d3.select(".scroll__graphic").append("div")
    .attr("class","legend")
    .style("opacity",.7)
    .style("position","inline")
    .style("left",margin.left+"px")
    // .style("top",mainheight+"px")

d3.tsv('https://gist.githubusercontent.com/Jasparr77/063eb94e3c46ed56f4bb373f53a37f34/raw/f9bc083b0d6711b0877621abecfca5b1c01ecc81/execTime.tsv',function(data){
    
    var parseDate = d3.timeParse("%Y-%m-%d")

    var parseTime = d3.timeParse("%H:%M:%S")
    var formatTime = d3.timeFormat("%H Hrs, %M Mins")

    data.forEach(function(d){
        d.date = parseDate(d.date)
        d.time_start = parseTime(d.time_start)
        d.time_end = parseTime(d.time_end)
        d.duration2 = parseTime(d.duration)
        d.duration = formatTime(d.duration2)
    })

    console.log(data)

    var zKeys = [];

    data.forEach(function(d){
        if(zKeys.indexOf(d.top_category) === -1) {
            zKeys.push(d.top_category);
        }
    });

    console.log(zKeys)
    color.domain(zKeys)

// Legend work
    var horiLeg = d3.select(".legend").append("svg")
    .attr("width", mainwidth)
    .attr("height","30px")

    var dataL = 0;
    var offset = 120;

    var legend4 = horiLeg.selectAll('.legend')
            .data(zKeys)
            .enter().append('g')
            .attr("class", "zKeys")
            .attr("transform", function (d, i) {
             if (i === 0) {
                dataL = d.length + offset 
                return "translate(0,0)"
            } else { 
             var newdataL = dataL
             dataL +=  d.length + offset
             return "translate(" + (newdataL) + ",0)"
            }
        })
        legend4.append('rect')
            .attr("x", 5)
            .attr("y", 5)
            .attr("width", 10)
            .attr("height", 10)
            .style("stroke","black")
            .attr("stroke-width",".1vw")
            .style("fill", function (d, i) {
            return color(i)
        })
        
        legend4.append('text')
            .attr("x", 20)
            .attr("y", 15)
        .text(function (d, i) {
            return d
        })
            .attr("class", "textselected")
            .style("text-anchor", "start")
            // .style("font-size", 15)
// End legend
    var y = d3.scaleBand()
    .domain(data.map(function(d){ return d.date;}).sort(d3.descending))
    .range([mainheight, 0]);

    var x = d3.scaleTime()
    .domain([new Date(1900, 0, 1), new Date(1900, 0, 2)])
    .range([0, mainwidth - margin.left - margin.right])

    var yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%m-%d"));

    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M"))

    chartGroup.selectAll("rect")
    .data(data)
    .enter().append("rect")
        .attr("class",function(d){return d.detail_category;})
        .attr("fill",function(d){return color(d.top_category)})
        .attr("x", function(d) { return x(d.time_start)})
        .attr("y", function(d) { return y(d.date)})
        .attr("height", y.bandwidth())
        .attr("width", function(d){ return x(d.duration2);})
        .style("opacity",.8)
    //   hoveraction
      .on("mouseover", function(d) {
        d3.select(this)
        .style("opacity",1)
        .attr("stroke","black")
        .attr("stoke-width",".2vw");
        div.html( (d.listed_title||d.top_category) + " | "+ d.duration)
            .transition().duration(600)
            .style("opacity",1)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })// fade out tooltip on mouse out               
    .on("mouseout", function() {
        d3.select(this)
        .style("opacity",.8)
        .attr("stroke","none")
        div.transition()
            .duration(500)
            .style("opacity", 0);
    });

    chartGroup.append("g")
    .attr("class","axis y")
    .attr("transform","translate("+(margin.left*1.05)+",0)")
    .call(yAxis)

    chartGroup.append("g")
    .attr("class","axis x")
    .attr("transform","translate(" + (margin.left*1.05) + "," + mainheight + ")")
    .call(xAxis)

// stack data, area chart by day for schedule. Exec Time in Orange, others in shades of blue? x axis == duration, y axis == date. ADD LEGEND, TOOLTIP

;})
