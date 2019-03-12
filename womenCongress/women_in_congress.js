// const scroller = scrollama();

var margin = { top: 20, right: 20, bottom: 60, left: 50 };

var mainwidth = (window.innerWidth - margin.left - margin.right)*(2/3),
	mainheight = (window.innerHeight*.5) - margin.top - margin.bottom;

var svg = d3.select(".scroll__graphic").append("svg")
	.attr("width", mainwidth + margin.left + margin.right)
	.attr("height", mainheight + margin.top + margin.bottom);

var chartGroup = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("https://gist.githubusercontent.com/Jasparr77/eb2c35c5ba28e5480569cb87b1e5a3a9/raw/318d0a20ae3646b265288ae7b0c6be6176a4e4a5/women_in_congress.csv", function (data){
	console.log(mainheight, mainwidth)
	var y = d3.scaleLinear()
	.domain([0,435])
	.range([mainheight, 0]);

	var x = d3.scaleBand()
	.domain(data.map(function(d){ return d.Years;}))
	.range([0, mainwidth])
	.paddingInner(.05)

	var yAxis = d3.axisLeft(y);

	var xAxis = d3.axisBottom(x).ticks(5)

	var line = d3.line()
	.x(function(d){ return x(d.Years) ;})
	.y(function(d){ return y(d.Women_total); })
	.curve(d3.curveNatural);

	var stack = d3.stack()
					.keys(["Republican","Democratic"])
					.order(d3.stackOrderNone)
					.offset(d3.stackOffsetNone);
	var datastack = stack(data);

	chartGroup.append("path")
		.attr("d",line(data))
		.attr("fill","none")
		.attr("class","totalCongress")  

	chartGroup.selectAll("circle.rep")
		.data(data)
		.enter().append("circle")
		.attr("class","rep")
		.attr("cx",function(d){return x(d.Years);})
		.attr("cy",function(d){return y(d.Republican);})
		.attr("r", (mainwidth/(208)))


	chartGroup.selectAll("circle.dem")
		.data(data)
		.enter().append("circle")
		.attr("class","dem")
		.attr("cx",function(d){return x(d.Years);})
		.attr("cy",function(d){return y(d.Democratic);})
		.attr("r", (mainwidth/(208)))

	chartGroup.append("g")
		.attr("class","axis y")
		.call(yAxis)

	chartGroup.append("g")
		.attr("class","axis x")
		.attr("transform","translate(0,"+mainheight+")")
		.call(xAxis)
		.selectAll("text")
		.attr("text-anchor","end")
		.attr("transform", "rotate(-90)")
});
function init() {
	window.addEventListener('resize', debounce(resize, 150))
}

init()