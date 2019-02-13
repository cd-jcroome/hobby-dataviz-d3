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
    .style("border-radius","none")
    .style("pointer-events","none");

d3.tsv('https://gist.githubusercontent.com/Jasparr77/673faca63682a4c8788025ac021a46df/raw/9525eccf53d6a5c1248c9ff0cf925eb29040d5c1/desi.tsv',function(data){
    
    var nested_data = d3.nest()
    .key(function(d){return d.Year.concat(d.Country);}).sortKeys(d3.ascending)
    .rollup(function(leaves) {
        return {
            totalScore: d3.sum(leaves, function(d){return d['Weighted Score'];})
        }
    })
    .entries(data).map(function(d) {
        return {
            year: d.key.substring(0, 4),
            country: d.key.substring(4),
            totalScore: d.value.totalScore
        };
    })

    console.log(data)
    console.log(nested_data)
    
    var y = d3.scaleLinear()
    .range([mainheight, 0])

    var x = d3.scaleBand()
    .domain(nested_data.map(function(d){ return d.year;}))
    .range([0, mainwidth])
    .paddingInner(.05)

    var color = d3.scaleOrdinal(d3.schemeCategory20)

    var yAxis = d3.axisLeft(y);

    var xAxis = d3.axisBottom(x);

    var line = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.totalScore); })
    .curve(d3.curveNatural);

    chartGroup.selectAll(".line")
    .data(nested_data)
    .enter()
    .append("path")
        .attr("class","countryLine")
        .attr("d", function(d){
            return line(d.totalScore);
        })
		.attr("fill","none")
        .attr("stroke","black")
        .attr("stroke-width", "1vw")
        .attr("opacity",".5")
        // .on("mouseover", function(d) {
        //     d3.select(this)
        //     .attr("id","selectedPath")
        //     .attr("stroke-width","1vw")
        //     .attr("opacity","100%");
        //     div.transition().duration(200).style("opacity", .9);
        //     div.html(d.key)
        //     .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
        //   })
        // .on("mouseout", function() {
        //   d3.select(this)
        //   .attr("id","selectedPath")
        //   .attr("stroke-width",".1vw")
        //   .attr("opacity",".5"),
        //   div.transition().duration(500).style("opacity", 0);
        //   });

        chartGroup.selectAll("circle")
		.data(nested_data)
		.enter().append("circle")
		.attr("cx", function(d){ return x(d.year) ;})
		.attr("cy", function(d){ return y(d.totalScore) ;})
		.attr("fill",function(d,i){return color(i);})
		.attr("r", "1.5vw")
		.attr("stroke","white")
		.attr("stroke-width", ".1vw")

    chartGroup.append("g")
    .attr("class","axis y")
    .call(yAxis)

    chartGroup.append("g")
    .attr("class","axis x")
    .attr("transform","translate(0,"+mainheight+")")
    .call(xAxis)
;})