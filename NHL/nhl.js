var margin = { top: 20, right: 20, bottom: 60, left: 50 };

var mainwidth = (window.innerWidth - margin.left - margin.right),
	mainheight = (window.innerHeight*.8) - margin.top - margin.bottom;

var svg = d3.select("#staticBody").append("svg")
.attr("class","container")
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom);

var div = d3.select("#staticBody").append("div")	
.attr("class", "tooltip")				
.style("opacity", "0")
.style("background","whitesmoke")
.style("position","absolute");

var chartGroup = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv('https://gist.githubusercontent.com/Jasparr77/27f28d6f8c3ade63793b08902d2a67c9/raw/e0a7a09d1d0fb90383042000e9576c7f54f0135c/NHL_Attendance', function(data){
	
	var nested_data = d3.nest()
	.key(function(d){return d.SEASON;})
	.rollup(function(leaves){return {
		avg_att: d3.sum(leaves, function(d){return d.Home_Attendance/d.HOME_GAMES ;}),
		home_win_pct: d3.mean(leaves, function(d){return ((d.HOME_WINS/d.HOME_GAMES)*100) ;})
	}})
	.entries(data)
	.map(function(d){return {Season:d.key, avgAtt:d.value.avg_att, homeWinPct:d.value.home_win_pct};})

	var y = d3.scaleLinear()
	.domain([d3.min(nested_data,function(d){return d.avgAtt;})*.95, d3.max(nested_data,function(d){return d.avgAtt;})*1.05])
	.range([mainheight*.85, 0]);

	var x = d3.scaleBand()
	.domain(data.map(function(d){ return d.SEASON;}))
	.range([0, mainwidth])
	.paddingInner(.05)

	var yAxis = d3.axisLeft(y);

	var xAxis = d3.axisBottom(x);	

	var colorScale = d3.scaleSequential(d3.interpolateViridis)
		.domain(d3.extent(nested_data,function(d){return d.homeWinPct;}))

	var line = d3.line()
	.x(function(d){ return x(d.Season) ;})
	.y(function(d){ return y(d.avgAtt) ;})
	.curve(d3.curveNatural);

	chartGroup.append("path")
		.data(nested_data)
		.attr("d",line(nested_data))
		.attr("fill","none")
		.attr("stroke","black")
		.attr("stroke-width", "5")
		.attr("transform", "translate(" + 20 + ",0)")
	
	chartGroup.selectAll("circle")
		.data(nested_data)
		.enter().append("circle")
		.attr("cx", function(d){ return x(d.Season) ;})
		.attr("cy", function(d){ return y(d.avgAtt) ;})
		.attr("fill",function(d){return colorScale(d.homeWinPct);})
		.attr("r", 6)
		.attr("stroke","white")
		.attr("stroke-width", ".1vw")
		.attr("transform", "translate(" + 20 + ",0)")
		.on("mouseover", function(d) {		
            div.transition()		
                .duration(200)		
                .style("opacity", ".9");		
            div.html(d.Season + "<br/>"  + 'Average Attendance: ' + Math.floor(d.avgAtt)/1000 +'k' 
			+ ' <br/>Average Home Win Pct: '
			+ (d.homeWinPct).toFixed(2)+'%')	
				.style("left", (d3.event.pageX)-margin.left + "px")
                .style("top", (d3.event.pageY)-(margin.top*5) + "px");	
            })					
        .on("mouseout", function(d) {		
            div.transition()		
                .duration(500)		
				.style("opacity", "0");
			})	
	
	chartGroup.append("g")
		.attr("class","axis y")
		.call(yAxis)

	chartGroup.append("g")
		.attr("class","axis x")
		.attr("transform","translate(0,"+mainheight*.85+")")
		.call(xAxis)
});