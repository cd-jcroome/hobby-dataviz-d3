const scroller = scrollama();

var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var chart2 = chart.select('.chart2');
var text = container.select('.scroll__text');
var step = text.select('.step');

var margin = { top: (window.innerWidth*.14), right: 80, bottom: 60, left: 80 };

var stepHeight = Math.floor(window.innerHeight * 0.75)

var chartGroup = d3.select(".chart").append("g").attr("class","chart2")

var formatPercent = d3.format(".0%")

var formatDate = d3.timeFormat("%Y-%m-%e")
var parseDate = d3.timeParse("%Y-%m-%e")

var formatYear = d3.timeFormat("%Y")
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

text.append("div")
    .attr("class", "step")
    .attr("data-step", "a")
    .attr("id","formholder")
    .html("<Form Name=\"userDOBForm\" onsubmit=\"init();return false\">When were you born?<input type=\"date\"name=\"userDobInput\" ID=\"userDobInput\" value=\""+formatDate(new Date())+"\" min=\""+formatDate(parseDate(1902-01-01))+"\"max=\""+formatDate(new Date())+"\"></br><input type=\"submit\"value=\"Submit\"></Form>");

var tooltip = d3.select(".tooltip");

function handleResize() {
    // 1. update height of step elements (moved to divs)
    d3.select('.step')
        .style("height",stepHeight + "px");
    // 2. update width/height of graphic element
    var bodyWidth = d3.select('body').node().offsetWidth;
    var textWidth = text.node().offsetWidth;

    yRange = (Math.floor(window.innerHeight*.65))
    xRange = bodyWidth *.65

    switch(window.innerHeight > window.innerWidth) {
        case false: var graphicWidth = bodyWidth - textWidth; break;
        case true: var graphicWidth = bodyWidth; break;
    }
       
    graphic
        .style('width', graphicWidth + 'px')
        .style('height', window.innerHeight*.70 + 'px');

    var chartMargin = 5;
    var chartWidth = graphic.node().offsetWidth - chartMargin;

    chart
        .style('width', chartWidth + 'px')
        .style('height', Math.floor(window.innerHeight*.70) + 'px');

    chart2
        .style('width', chartWidth + 'px')
        .style('height', Math.floor(window.innerHeight*.70) + 'px');

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
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

// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    switch (response.index){
        case 0: 
            d3.selectAll(".title").remove()
            d3.selectAll("circle").remove()
            d3.selectAll(".axis").remove()

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
                // .style("line stroke","white")
                .call(xAxis);
            chartGroup.append("text")
                .attr("transform","translate("+(xRange/2)+","+ (yRange+5)+")")
                .style("text-anchor","middle")
                .text("years");
            
            chartGroup.append("g")
                .attr("class","axis y")
                .attr("transform","translate("+(margin.left)+",0)")
                // .style("line stroke","white")
                .call(yAxis);
            chartGroup.append("text")
                .attr("y",margin.left-30)
                .attr("x",0-(yRange/2))
                .attr("transform","rotate(-90)")
                .style("text-anchor","middle")
                .text("weeks");

            (d3.timeDay.count(userDob,now) < 1) ?    
                text.append("div").append("text")
                    .attr("class","title")
                    .style("position","absolute")
                    .style("top","0%")
                    .style("right","50%")
                    .style("font-size","2vw")
                    .style("font-color","black")
                    .text("When were you born?")
                :
                text.append("div").append("text")
                    .attr("class","title")
                    .style("position","absolute")
                    .style("top","0%")
                    .style("right","50%")
                    .style("font-size","2vw")
                    .style("font-color","black")
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
            ;
        ; break;
    }
}

function handleContainerEnter(response) {
    // response = { direction }
}

function handleContainerExit(response) {
    // response = { direction }
}

function setupStickyfill() {
    d3.selectAll('.sticky').each(function () {
        Stickyfill.add(this);
    });
}

function init() {
    getUserAge();  
    setupStickyfill();

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();  

    // 2. setup the scroller passing options
    // this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller.setup({
        container: '#scroll',
        graphic: '.scroll__graphic',
        text: '.scroll__text',
        step: '.scroll__text .step',
        offset: '.8',
        debug: false,
    })
        .onStepEnter(handleStepEnter);
        // .onContainerEnter(handleContainerEnter)
        // .onContainerExit(handleContainerExit);
    // setup resize event
    window.addEventListener('resize', handleResize);
}

init();
