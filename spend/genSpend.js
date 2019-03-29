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
    .html("<h1>Spending Shifts Across the Generations</h1>")
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
    .html("<p>Across the four groups studied, traditionalists devote the highest percentage of their income to the pharmacy.</p>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "e")
    .html("<p>Baby Boomers, who are the most likely to own a house, also spend the most on building supplies and furniture across all four generations.</p>")
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
    d3.tsv('https://gist.githubusercontent.com/Jasparr77/07daab41f9af3682c2de4c5f399664e0/raw/4d8ec48429ab0baa0abf8de52395a71631538321/genSpend.tsv',function(data){
        console.log('Raw Data:',data)
        dict.data = data

        var zKeys = [];

        data.forEach(function(d)
            {if(zKeys.indexOf(d['Category']) === -1) {zKeys.push(d['Category']);}
        });
        console.log('keys:',zKeys)

        var nestData = d3.nest()
        .key(function(d){return d['Generation']})
        .key(function(d){return d['Category']})
        .rollup(function(leaves){
            return d3.sum(leaves, function(d){return d['% of Spending']; })
        })
        .entries(data)
        console.log("Nested",nestData)

        var flatData = [];
        nestData.forEach(function(d) {
        var obj = { Generation: d.key }
            d.values.forEach(function(f) {
                obj[f.key] = f.value || 0;
            });
        flatData.push(obj);
        });
        console.log("now it's flat",flatData)

        stackData = d3.stack().keys(zKeys)(flatData)
        console.log("finally, a stack:",stackData)

        dict.data = stackData
        dict.zKeys = zKeys

    })
}

// scrollama event handlers
function handleStepEnter(response) {
    // response = { element, direction, index }
    switch (response.index){
        case 0: // scroll prompt
            yRange = (Math.floor(window.innerHeight*.65))
            xRange = (graphic.node().offsetWidth - 5 - margin.left)
            
            graphic.selectAll(".title").remove()
            chartGroup.selectAll("rect").remove()
            chartGroup.selectAll(".axis").remove()
        ; break;
        case 1: // list out 4 generations - stacked area with no height
            data = dict.data;
            zKeys = dict.zKeys;

            var y = d3.scaleLinear()
                .domain([0,0])
                .range([yRange,yRange])
            var yAxis = d3.axisLeft(y);

            var x = d3.scaleBand()
                .domain(['Traditionalists','Baby Boomers','Generation X','Millenials'])
                .range([0,xRange])
            var xAxis = d3.axisBottom(x);

            chartGroup.append("g")
            .attr("class","axis y")
            .attr("transform","translate("+(margin.left)+",0)")
            .style("font-size","2vw")
            .call(yAxis)
            
            chartGroup.append("g")
            .attr("class","axis x")
            .attr("transform","translate("+(margin.left)+"," + yRange + ")")
            .style("font-size","2vw")
            .call(xAxis)
            
            color = d3.scaleOrdinal().range(['grey','darkgrey','lightgrey','whitesmoke','hotpink','limegreen','steelblue']);

            color.domain(zKeys);

            chartGroup.append("g")
                .selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("fill", function(d){return color(d.key);})
                .attr("opacity",.5)
                .attr("class",function(d,i){return "bar "+d.key.substring(0,3);})
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("class",function(d){return d.data.Generation; })
                .attr("x", function(d) { return x(d.data.Generation); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth())
                .attr("transform","translate("+(margin.left)+",0)");

        ; break;
        case 2:  // expand y axis to show all categories
            var y = d3.scaleLinear()
                .domain([0,1])
                .range([yRange,50])
            var yAxis = d3.axisLeft(y);

            chartGroup.select(".y")
                .transition()
                .call(yAxis)

            chartGroup.selectAll("rect")
                .transition()
                .attr("y",function(d){return y(d[1]);})
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
    
                var dataL = 0;
                var offset = 150;
    
                var legend = chartGroup.selectAll('.legend')
                        .data(zKeys)
                        .enter().append('g')
                        .attr("class", "zKeys")
                        .attr("transform", function (d, i) {
                        if (i === 0) {
                            dataL = d.length + offset 
                            return "translate("+margin.left+",0)"
                        } else { 
                        var newdataL = dataL
                        dataL +=  d.length + offset
                        return "translate(" + (newdataL) + ",0)"
                        }
                    })
                    legend.append('rect')
                        .attr("x", 5)
                        .attr("y", 5)
                        .attr("width", 10)
                        .attr("height", 10)
                        .style("fill", function (d, i) { return color(i) })
                    
                    legend.append('text')
                        .attr("x", 20)
                        .attr("y", 15)
                    .text(function (d, i) { return d })
                        .attr("class", "textselected")
                        .style("text-anchor", "start")

        ; break;
        case 3: // just Pharmacy

        chartGroup.selectAll(".Pha")
        .transition()
        .style("stroke","black")
        .style("stroke-width",".2vw")
        .attr("opacity",1)
                
        ; break;
        case 4: // just home & building
        
        chartGroup.selectAll(".Pha")
        .transition()
        .style("stroke","none")
        .style("stroke-width","0")
        .style("z-index","-99999")
        .attr("opacity",.5)

        chartGroup.selectAll(".Fur")
        .transition()
        .style("stroke","black")
        .style("stroke-width",".2vw")
        .attr("opacity",1)

        ; break;
        case 5: // just boomers, gen x & millenials
            chartGroup.selectAll(".bar")
                .transition()
                .style("stroke","none")
                .style("stroke-width","0")
                .attr("opacity",".5")
                .attr("transform","translate("+(0-(xRange/4))+")");

            chartGroup.selectAll(".Traditionalists")
                .transition()
                .style("opacity","0");

            var x = d3.scaleBand()
                .domain(['Baby Boomers','Generation X','Millenials'])
                .range([0,(xRange*.75)])
                var xAxis = d3.axisBottom(x);

            chartGroup.selectAll(".x")
                .transition()
                .call(xAxis);
        ; break;
        case 6: // just milennials - group all others (not the big 3)?
        ; break;
        case 7: // back to stacked area - group categories in experiential, misc & responsible?
        ; break;
        case 8: // flip x axis
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
        .onStepEnter(handleStepEnter);
        // .onContainerEnter(handleContainerEnter)
        // .onContainerExit(handleContainerExit);
    // setup resize event
    window.addEventListener('resize', handleResize);
}

init();
