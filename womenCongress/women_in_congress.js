var margin = { top: 5, right: 40, bottom: 50, left: 20 };

var mainwidth = (window.innerWidth - margin.left - margin.right)
	mainheight = (window.innerHeight*.5) - margin.top - margin.bottom;

var svg = d3.select("#staticBody").append("svg")
	.attr("width", mainwidth + margin.left + margin.right)
	.attr("height", mainheight + margin.top + margin.bottom);

var chartGroup = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("#staticBody").append("div")
	.attr("class", "tooltip")
	.style("opacity", "0")
	.style("width", "40")
	.style("position","absolute")
	.style("text-align","center")
	.style("background","lightsteelblue")
	.style("padding","8px")
	.style("border-radius","none")
	.style("pointer-events","none")

d3.csv("https://gist.githubusercontent.com/Jasparr77/eb2c35c5ba28e5480569cb87b1e5a3a9/raw/318d0a20ae3646b265288ae7b0c6be6176a4e4a5/women_in_congress.csv", function (data){
	var Women_total = Number(data.Women_total)
	console.log("data: ",data)
	
	var y = d3.scaleLinear()
	.domain([0, data[50].Women_total])
	.range([mainheight, 0]);
	
	var x = d3.scaleBand()
	.domain(data.map(function(d){ return d.Years; }))
	.range([0, mainwidth])
	.paddingInner(.05)

	var yAxis = d3.axisLeft(y);

	var xAxis = d3.axisBottom(x).ticks(5)

	var line = d3.line()
	.x(function(d){ return x(d.Years) ;})
	.y(function(d){ return y(d.Women_total); })
	.curve(d3.curveNatural);

	chartGroup.append("path")
		.attr("d",line(data))
		.attr("fill","none")
		.attr("class","totalCongress")  
		.style("stroke","brown")
		.style("stroke-width","4px")
		// .on("mouseover",function(data){
		// 	div.transition().duration(200).style("opacity", .9);
        //     div.html(function(d){return d;})
        //     })
		// .on("mouseout", function() {
        //     div.transition().duration(500).style("opacity", 0);
		// });

	chartGroup.selectAll("circle.rep")
		.data(data)
		.enter().append("circle")
		.attr("class","rep")
		.attr("cx",function(d){return x(d.Years);})
		.attr("cy",function(d){return y(d.Republican);})
		.style("fill","red")
		.style("stroke","white")
		.attr("r", (mainwidth/(180)))
		.on("mouseover", function(d) {
            div.transition().duration(200).style("opacity", .9);
            div.html(d.Years + "<br/>" 
			+ d.Republican + " Republican Congresswomen" + "<br/>"
			+ d.Women_total + " Total Congresswomen")
            })
		.on("mouseout", function() {
            div.transition().duration(500).style("opacity", 0);
        });


	chartGroup.selectAll("circle.dem")
		.data(data)
		.enter().append("circle")
		.attr("class","dem")
		.attr("cx",function(d){return x(d.Years);})
		.attr("cy",function(d){return y(d.Democratic);})
		.style("fill","blue")
		.style("stroke","white")
		.attr("r", (mainwidth/(180)))
		.on("mouseover", function(d) {
            div.transition().duration(200).style("opacity", .9);
            div.html(d.Years + "<br/>"
			+ d.Democratic + " Democratic Congresswomen" +"<br/>"
			+ d.Women_total + " Total Congresswomen")
            })
		.on("mouseout", function() {
            div.transition().duration(500).style("opacity", 0);
        });

	chartGroup.append("g")
		.attr("class","axis y")
		.call(yAxis)

	chartGroup.append("g")
		.attr("class","axis x")
		.attr("transform","translate(0,"+mainheight+")")
		.call(xAxis)
		.selectAll("text")
		.attr("text-anchor","start")
		.attr("transform", "rotate(45)")
});