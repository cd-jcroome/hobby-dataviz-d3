const scroller = scrollama();

var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var chart2 = chart.select('.chart2');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

var margin = { top: (window.innerWidth*.14), right: 80, bottom: 60, left: 80 };

var stepHeight = Math.floor(window.innerHeight * 0.75)

var chartGroup = d3.select(".chart").append("g").attr("class","chart2")

yRange = (Math.floor(window.innerHeight*.6))
xRange = (graphic.node().offsetWidth - 5 - margin.left)

var formatPercent = d3.format(".0%")

var formatDate = d3.timeFormat("%Y-%m-%e")
var parseDate = d3.timeParse("%Y-%m-%e")

var nestData = []
var dict = []
var weeks =[]
var now = new Date;

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
    .attr("id","formholder")
    .html("<Form Name=\"userDOBForm\" onsubmit=\"getUserAge();return false\">When were you born?:<input type=\"date\"name=\"userDobInput\" ID=\"userDobInput\" min=\"01/01/1900\"max=\""+formatDate(new Date())+"\"><input type=\"submit\"value=\"Submit\"></Form>");    

text.append("div")
    .attr("class", "step")
    .attr("data-step", "a")
    .html("<h1>You've lived a shit-ton of weeks already</h1>")
    .style("height",stepHeight +"px");

var tooltip = d3.select(".tooltip");

function handleResize() {
    // 1. update height of step elements (moved to divs)

    // 2. update width/height of graphic element
    var bodyWidth = d3.select('body').node().offsetWidth;
    var textWidth = text.node().offsetWidth;

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
    
    weeks = d3.timeDay.range(userDob,userDod,7)
    weeksAlive = Math.floor(d3.timeDay.count(userDob,now)/7)
    console.log(weeksAlive)
    for (var i = 0, len = (90*52); i < len; i++) {
        wk = (i*7)
        weeks.push([d3.timeDay.offset(userDob,wk),((i > Math.floor(d3.timeDay.count(userDob,now)/7)) ? "past" : "present")]);
      }

    console.log(weeks)
// ask the user their DOB
}

// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    switch (response.index){
        case 0: 
            var x = d3.scaleBand()
                    .domain(['0','100'])
                    .range([0,xRange])
            var xAxis = d3.axisBottom(x).tickValues([]);
            
            var y = d3.scaleBand()
                    .domain(['0','52'])
                    .range([yRange],0)
            var yAxis = d3.axisLeft(y).tickValues([]);

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
        offset: '.74',
        debug: false,
    })
        .onStepEnter(handleStepEnter);
        // .onContainerEnter(handleContainerEnter)
        // .onContainerExit(handleContainerExit);
    // setup resize event
    window.addEventListener('resize', handleResize);
}

init();
