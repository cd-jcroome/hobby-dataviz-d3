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

d3.tsv('https://gist.githubusercontent.com/Jasparr77/063eb94e3c46ed56f4bb373f53a37f34/raw/f9bc083b0d6711b0877621abecfca5b1c01ecc81/execTime.tsv',function(data){
    
    var parseDate = d3.timeParse("%Y-%m-%d")

    data.forEach(function(d){
        d.date = parseDate(d.date)
    })

    console.log(data)

    var zKeys = [];

    data.forEach(function(d){
        if(zKeys.indexOf(d.detail_category) === -1) {
            zKeys.push(d.detail_category);
        }
    });

    console.log(zKeys)
    color.domain(zKeys)

    var y = d3.scaleBand()
    .domain(data.map(function(d){ return d.date;}).sort(d3.descending))
    .range([mainheight, 0]);

    var x = d3.scaleTime()
    .domain([-30000000,30000000])
    .range([0, mainwidth])

    var yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%m-%d"));

    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%H:%M"))

    chartGroup.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("fill", function(d){return color(d.key);})
    .attr("opacity",.8)
    .attr("class",function(d){return d.key;})
    .selectAll("rect")
    .data(function(d) { return d; })
    .enter().append("rect")
      .attr("x", function(d) { return x(d.time_start); })
      .attr("y", function(d) { return y(d.date)})
      .attr("height", y.bandwidth())
      .attr("width", function(d){ return x(d.time_end-d.time_start);})
    //   hoveraction
      .on("mouseover", function(d) {
        d3.select(this)
        .style("opacity",1)
        .attr("stroke","black")
        .attr("stoke-width",".2vw");
        div.html(d.data.date + " | "+ g.class).transition()
            .duration(600)
            .style("opacity",1)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
    })// fade out tooltip on mouse out               
    .on("mouseout", function() {
        d3.select(this)
        .style("opacity",1)
        .attr("stroke","none");
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

    var g = svg.append("g")
    .attr("transform", "translate(" + (margin.left*1.05) + "," + margin.top + ")");

// stack data, area chart by day for schedule. Exec Time in Orange, others in shades of blue? x axis == duration, y axis == date. ADD LEGEND, TOOLTIP

;})
