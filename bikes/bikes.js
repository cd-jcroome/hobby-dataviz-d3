
var margin = { top: 20, right: 20, bottom: 60, left: 50 };

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
    .style("border-radius","8px")
    .style("pointer-events","none");

    var parseDate = d3.timeParse("%d/%m/%Y");
    var formatYear = d3.timeFormat("%Y");
    var formatMonth = d3.timeFormat("%m")
    var formatDate = d3.timeFormat("%b '%y");

d3.csv('https://query.data.world/s/gll3zvqrc2rutcsme5skjtwvl4mxqr',function(data){
    data.forEach (function(d) {
        switch ( formatMonth(parseDate(d['Date']))){
            case '01': d.quarter = 'Q1'; break;
            case '04': d.quarter = 'Q2'; break;
            case '07': d.quarter = 'Q3'; break;
            case '10': d.quarter = 'Q4'; break;
        }
        d.year = formatYear(parseDate(d['Date'])),
        d['Date'] = parseDate(d['Date']),
        d['Manual Bikes'] = parseInt(d['Manual Bikes'])||0,
        d['e-Bikes'] = parseInt(d['e-Bikes'])||0,
        d['Gross Value Added'] = parseInt(d['Gross Value Added'])||0
    })
    data.sort(function(d,f){
        return d3.ascending(d.Date,f.Date)
    })
    console.log('Raw Data:',data)
    
    nestData = d3.nest()
    .key(function(d){return d.quarter;})
    .key(function(d){return d.year})
    .rollup(function(leaves){return{
        manual : d3.sum(leaves, function(d){return d['Manual Bikes'];}),
        ebike : d3.sum(leaves, function(d){return d['e-Bikes'];})
        }
    })
    .entries(data)
    console.log('Nested:',nestData)

    var y = d3.scaleLinear()
    .domain([0,d3.max(data, function(d){return d['e-Bikes']+d['Manual Bikes']})])
    .range([mainheight, 0]);

    var yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));

    var x = d3.scaleBand()
    .domain(data.map(function(d){return d['year'];}))
    .range([0, mainwidth - margin.left - margin.right])

    var xAxis = d3.axisBottom(x);

    var manLine = d3.line()
        .x(function(d) {return x(d.key);})
        .y(function(d) {return y(d.value.manual);})
        .curve(d3.curveNatural);

    var eLine = d3.line()
        .x(function(d) {return x(d.key);})
        .y(function(d) {return y(d.value.ebike);})
        .curve(d3.curveNatural);

    chartGroup.selectAll(".manual .line")
    .data(nestData)
    .enter().append("path")
        .attr("class",function(d){return d.key+" manual line";})
        .attr("d",function(d){ return manLine(d.values);})
        .attr("fill","none")
        .attr("stroke-width",".2vw")
        .attr("stroke","grey")
        .attr("opacity",.6)
        .attr("transform","translate("+mainwidth*.1+",0)")
    .on("mouseover",function(d){
        d3.select(this)
        .attr("r","2vw")
        // .attr("stroke","black")
        .attr("opacity",1)
        .attr("stoke-width","1vw");
        div.transition().duration(600).style("opacity", .95);
        div.html(d.key+" Manual imports")
            .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
        d3.select(this)
        .attr("r",".6vw")
        .attr("opacity",.6);
        div.transition().duration(800).style("opacity", 0);
    });

    chartGroup.selectAll(".ebike .line")
    .data(nestData)
    .enter().append("path")
        .attr("class",function(d){return d.key+" ebike line";})
        .attr("d",function(d){ return eLine(d.values);})
        .attr("fill","none")
        .attr("stroke-width",".2vw")
        .attr("stroke","green")
        .attr("opacity",.6)
        .attr("transform","translate("+mainwidth*.1+",0)")
    .on("mouseover",function(d){
        d3.select(this)
        .attr("r","2vw")
        // .attr("stroke","black")
        .attr("opacity",1)
        .attr("stoke-width","1vw");
        div.transition().duration(600).style("opacity", .95);
        div.html(d.key+" e-Bike imports")
            .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
        d3.select(this)
        .attr("r",".6vw")
        .attr("opacity",.6);
        div.transition().duration(800).style("opacity", 0);
    });

    chartGroup.selectAll(".manual .circle")
    .data(data)
    .enter().append("circle")
        .attr("cx", function(d){ return x(d.year) ;})
        .attr("cy", function(d){ return y(d['Manual Bikes']) ;})
        .attr("fill","brown")
        .attr("class",function(d){return d.quarter+" manual circle";})
        .attr("r", ".3vw")
        .attr("stroke","white")
        .attr("stroke-width", ".1vw")
        .attr("transform","translate("+mainwidth*.1+",0)")
        .attr("opacity",.5)
    .on("mouseover", function(d) {
        d3.select(this)
        .attr("r","2vw")
        .attr("stroke","black")
        .attr("stoke-width",".2vw")
        .style("opacity",1)
        div.transition().duration(600).style("opacity", .95);
        div.html(d.quarter + " Manual Imports<br/>"
        + d.year +": " + d['Manual Bikes'].toLocaleString("en", {style: "decimal"})
        ).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    })// fade out tooltip on mouse out               
    .on("mouseout", function() {
        d3.select(this)
        .attr("r",".3vw")
        .style("opacity",.5);
        div.transition().duration(500).style("opacity", 0);
    });
    
    chartGroup.selectAll(".ebike .circle")
    .data(data)
    .enter().append("circle")
        .attr("cx", function(d){ return x((d.year)) ;})
        .attr("cy", function(d){ return y(d['e-Bikes']) ;})
        .attr("fill","salmon")
        .attr("class",function(d){return d.quarter+" ebike circle";})
        .attr("r", ".3vw")
        .attr("stroke","white")
        .attr("stroke-width", ".1vw")
        .attr("transform","translate("+mainwidth*.1+",0)")
        .style("opacity",.5)
    .on("mouseover", function(d) {
        d3.select(this)
        .attr("r","2vw")
        .attr("stroke","black")
        .attr("stoke-width",".2vw")
        .style("opacity",1);
        div.transition().duration(600).style("opacity", .95);
        div.html(d.quarter + " e-Bike Imports<br/>"
        +d.year+": " + d['e-Bikes'].toLocaleString("en", {style: "decimal"})
        ).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    })// fade out tooltip on mouse out               
    .on("mouseout", function() {
        d3.select(this)
        .attr("r",".3vw")
        .style("opacity",.5);
        div.transition().duration(500).style("opacity", 0);
    });

    chartGroup.selectAll(".Q1")
        .attr("stroke","steelblue")
    chartGroup.selectAll(".Q2")
        .attr("stroke","lightblue")
    chartGroup.selectAll(".Q3")
        .attr("stroke","blue")
    chartGroup.selectAll(".Q4")
        .attr("stroke","navy")
    

    chartGroup.append("g")
    .attr("class","axis y")
    .attr("transform","translate("+(margin.left*1.05)+",0)")
    .call(yAxis)

    chartGroup.append("g")
    .attr("class","axis x")
    .attr("transform","translate(" + (margin.left*1.05) + "," + mainheight + ")")
    .call(xAxis)


;})