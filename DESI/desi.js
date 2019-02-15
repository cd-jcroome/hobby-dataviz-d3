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
    .style("border-radius","8px")
    .style("pointer-events","none");

d3.tsv('https://gist.githubusercontent.com/Jasparr77/673faca63682a4c8788025ac021a46df/raw/9525eccf53d6a5c1248c9ff0cf925eb29040d5c1/desi.tsv',function(data){
    
    var line_data = d3.nest()
        .key(function(d){return d.Country})
        .key(function(d){return d.Year}).sortKeys(d3.ascending)
        .rollup(function(leaves){
            return {totalScore: d3.sum(leaves, function(d){return d['Weighted Score'];})}
        })
        .entries(data)

    var nested_data = d3.nest()
    .key(function(d){return d.Year.concat(d.Country);}).sortKeys(d3.ascending)
    .rollup(function(leaves) {
        return {
            totalScore: d3.sum(leaves, function(d){return d['Weighted Score'];})
        }
    })
    .entries(data).map(function(d,i) {
        return {
            year: d.key.substring(0, 4),
            country: d.key.substring(4),
            number: (i+1)-((d.key.substring(0, 4)-2014)*29),
            totalScore: d.value.totalScore
        };
    })

    console.log(line_data)
    console.log(nested_data)
    console.log(line_data)
    
    var y = d3.scaleLinear()
    .domain([d3.min(nested_data, function(d){return d.totalScore;})*.8, d3.max(nested_data, function(d){return d.totalScore;})])
    .range([mainheight, 0])

    var x = d3.scaleBand()
    .domain(nested_data.map(function(d){ return d.year;}))
    .range([0, mainwidth])

    var color = d3.scaleOrdinal(d3.schemeCategory20)
    var greys = d3.scaleOrdinal().range(["#f2f0f7", "#dadaeb", "#bcbddc", "#9e9ac8", "#756bb1", "#54278f"])

    var yAxis = d3.axisLeft(y);

    var xAxis = d3.axisBottom(x);

    var yearline = d3.line()
        .x(function(d) {return x(d.key);})
        .y(function(d) {return y(d.value.totalScore);});

    chartGroup.selectAll(".line")
    .data(line_data)
    .enter()
    .append("path")
        .attr("class",function(d){return d.key;})
        .attr("d",function(d){ return yearline(d.values);})
        .attr("fill","none")
        .attr("stroke-width",".01vw")
        .attr("stroke","grey")
        .attr("transform","translate("+mainwidth*.1+",0)")

    chartGroup.selectAll("circle")
    .data(nested_data)
    .enter().append("circle")
    .attr("cx", function(d){ return x(d.year) ;})
    .attr("cy", function(d){ return y(d.totalScore) ;})
    .attr("fill",function(d,i){return color(d.number);})
    .attr("class",function(d){return d.country;})
    .style("opacity",.5)
    .attr("r", ".5vw")
    .attr("stroke","white")
    .attr("stroke-width", ".1vw")
    .attr("transform","translate("+mainwidth*.1+",0)")
    .on("mouseover", function(d) {
        d3.select(this)
        .attr("r","2vw")
        .attr("fill",function(d,i){return color(d.number);})
        .style("opacity",1);
        chartGroup.selectAll("line").filter(function(d){return d.country;})
        .attr("stroke","black")
        .attr("stoke-width",".1vw");
        div.transition().duration(200).style("opacity", .95);
        div.html(d.country + " | "+ d.year +"<br/>"
        +"Weighted DESI: "+ d.totalScore.toLocaleString("en", {style: "decimal",minimumFractionDigits: 2})+"<br/>"
        // +"Rank: "+(i)
        ).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
    })// fade out tooltip on mouse out               
    .on("mouseout", function() {
        d3.select(this)
        .attr("r",".5vw")
        .attr("fill",function(d,i){return greys(d.number);})
        .style("opacity",.5);
        div.transition().duration(500).style("opacity", 0);
    });

    chartGroup.selectAll(".line")
    .data(line_data)
    .enter()
    .append("path")
        // .attr("class",function(d){return d.key+"Line"})
        .attr("d", function(d){
            return line(d.values);
        })
		.attr("fill","none")
        .attr("stroke","black")
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