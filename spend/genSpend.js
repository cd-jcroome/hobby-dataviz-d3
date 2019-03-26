const scroller = scrollama();

var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var chart2 = chart.select('.chart2');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

var margin = { top: (window.innerWidth*.14), right: 0, bottom: 60, left: 40 };

var stepHeight = Math.floor(window.innerHeight * 0.75)

var chartGroup = d3.select(".chart").append("g").attr("class","chart2")

var nestData = []
var dict = []

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
    .html("<h1>Spending Shifts</h1><br><h2>Across the Generations</h2>")
    .style("height",stepHeight +"px");
        
text.append("div")
    .attr("class", "step")
    .attr("data-step", "b")
    .html("<p>Merril Lynch <a href=\"https://finance.yahoo.com/news/chart-reveals-huge-difference-millennials-201133732.html\">tracked the current spending habits</a> of 4 Generations...</p>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "c")
    .html("<p>and compared them across 7 broad categories. Some interesting notes:</p>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "d")
    .html("<p>Traditionalists devote the highest percentage of their income to the pharmacy.</p>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "e")
    .html("<p>Baby Boomers, who are the most likely to own a house, also spend the most on building supplies and furniture.</p>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "f")
    .html("<p>Gen X-ers, who are caught between the hot millenials and the rich baby boomers, seem to be mid-transition from young to old.</p>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "g")
    .html("<p>Millenials spend over 50% of their disposable income on eating out, buying consumer goods, and driving places.</p>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "h")
    .html("<p>Overall, the shift towards consumer spending in the younger generations is concerning. Interestingly, if you flip the order of these generations... </p>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "i")
    .html("<p>It appears as though the older we get, the more responsible we become. </p>")
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

function getTransformData() {
    d3.csv('https://query.data.world/s/rvirs26nc6vuxmsok6g2o4wr4644s6',function(data){
        console.log('Raw Data:',data)
        dict.data = data
    })
}

// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    switch (response.index){
        case 0: // scroll prompt
            graphic.selectAll(".title").remove()

            chartGroup.selectAll(".line").remove()
            chartGroup.selectAll(".circle").remove()
            chartGroup.selectAll(".axis").remove()
        ; break;
        case 1: // manual bike imports
        ; break;
        case 2:  // ebike imports
        ; break;
        case 3: // expand years to 2019, add question marks?
        ; break;
        case 4: // expand years to 2019, add question marks?
        ; break;
        case 5: // expand years to 2019, add question marks?
        ; break;
        case 6: // expand years to 2019, add question marks?
        ; break;
        case 7: // expand years to 2019, add question marks?
        ; break;
        case 8: // expand years to 2019, add question marks?
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
    getTransformData();  
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
        .onStepEnter(handleStepEnter)
        .onContainerEnter(handleContainerEnter)
        .onContainerExit(handleContainerExit);
    // setup resize event
    window.addEventListener('resize', handleResize);
}

init();
