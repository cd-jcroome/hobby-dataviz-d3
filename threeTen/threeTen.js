var container = d3.select('#staticBody')

var margin = { top: (window.innerWidth*.14), right: 80, bottom: 60, left: 80 };

var formatPercent = d3.format(".0%")
var formatDate = d3.timeFormat("%Y-%m-%e")
var formatYear = d3.timeFormat("%Y")
var parseDate = d3.timeParse("%Y-%m-%e")
var formatWeek = d3.timeFormat("%U")

var nestData = []
var dict = []
var weeks =[]

var now = new Date;
var lifeExp = 76

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

container.append("div")
    .attr("id","formholder")
    .style("top","0px")
    .style("height","2vh")
    .style("position","inline")
    .html("<Form Name=\"userDOBForm\" onsubmit=\"init();return false\">When were you born?    <input type=\"date\"name=\"userDobInput\" ID=\"userDobInput\" value=\""+formatDate(new Date())+"\" min=\""+formatDate(parseDate(1902-01-01))+"\"max=\""+formatDate(new Date())+"\">     <input type=\"submit\"value=\"Submit\"></Form>");


container.append('svg').attr('class','chart');

var tooltip = d3.select(".tooltip");
var formHolder = d3.select("#formholder");
var chartGroup = d3.select(".chart")

function handleResize() {
    var bodyWidth = (Math.floor(window.innerWidth*.95));
    yRange = (Math.floor(window.innerHeight*.65))
    xRange = bodyWidth *.95


    var chartMargin = 5;
    var chartWidth = xRange-chartMargin;

    chartGroup
        .style('width', chartWidth + 'px')
        .style('height', Math.floor(window.innerHeight*.70) + 'px');
}

function getUserAge() {
    userDob = parseDate(document.getElementById('userDobInput').value)
    userDod = d3.timeDay.offset(userDob,(90*52*7))
    
    // weeks = d3.timeDay.range(userDob,userDod,7)
    weeks = []
    weeksAlive = Math.floor(d3.timeDay.count(userDob,now)/7)
    for (var i = 0, len = (lifeExp*52); i < len; i++) {
        wk = (i*7),
        weeks.push([
            d3.timeDay.offset(userDob,wk),
            (formatWeek(d3.timeWeek(d3.timeDay.offset(userDob,wk)))),
            (formatYear(d3.timeYear(d3.timeDay.offset(userDob,wk)))-formatYear(d3.timeYear(userDob))),
            (i < Math.floor(d3.timeDay.count(userDob,now)/7)+1) ? "past" : "present"
    ]);
      }

    console.log((d3.timeDay.count(userDob,now) < 1) ? "no date entered yet" : weeks)
}

function drawDots() {
    var x = d3.scaleLinear()
            .domain([d3.min(weeks, function(d){return d[2];}),d3.max(weeks, function(d){return d[2];})])
            .range([10,xRange])
    var xAxis = d3.axisBottom(x).tickValues(['5','10','15','20','25','30','35','40','45','50','55','60','65','70']);
    
    var y = d3.scaleLinear()
            .domain([0,54])
            .range([(yRange-30),0])
    var yAxis = d3.axisLeft(y).tickValues(['13','26','39','52']);

    chartGroup.append("g")
        .attr("class","axis x")
        .attr("transform","translate("+(margin.left)+"," + (yRange-25) + ")")
        .call(xAxis);
    chartGroup.append("text")
        .attr("transform","translate("+(xRange/2)+","+ (yRange+5)+")")
        .style("text-anchor","middle")
        .text("years");

    chartGroup.append("g")
        .attr("class","axis y")
        .attr("transform","translate("+(margin.left)+",0)")
        .call(yAxis);
    chartGroup.append("text")
        .attr("y",margin.left-30)
        .attr("x",0-(yRange/2))
        .attr("transform","rotate(-90)")
        .style("text-anchor","middle")
        .text("weeks");

    (d3.timeDay.count(userDob,now) < 1) ?    
        formHolder.append("div").append("text")
            .attr("class","vizTitle")
            .style("position","absolute")
            .style("top","0%")
            .style("left","50%")
            .style("font-size","2vw")
            .style("font-color","black")
            .text("When were you born?")
        :
        d3.select(".vizTitle").transition()
            .text("You've lived "+Math.floor(d3.timeDay.count(userDob,now)/7)+" weeks.")
    ;
    
    chartGroup.selectAll("circle")
        .data(weeks)
        .enter().append("circle")
        .attr("class",function(d){return d[2]+d[1];})
        .attr("id",function(d){return d[0];})
        .attr("cx",function(d){return x(d[2]);})
        .attr("cy",function(d){return y(d[1]);})
        .attr("r",".3vw")
        .attr("fill","lightgrey")
        .attr("transform","translate("+(margin.left)+",0)")
        
    chartGroup.selectAll("circle")
        .transition()
        .attr("fill",function(d){return (d[3] == "past")? "steelblue":"lightgrey"})
        }

function init() {  
    handleResize();
    getUserAge();  
    drawDots();
    window.addEventListener('resize', handleResize);
}

init();
