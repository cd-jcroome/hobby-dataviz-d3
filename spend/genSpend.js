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

var formatPercent = d3.format(".0%")

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
    .html("<p>Gen X-ers seem to be mid-transition from young to old. Note that the only category where they're not in between boomers and millenials is Pharmacies, where they spend slightly less than millenials.</p>")
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
            var yAxis = d3.axisLeft(y).tickValues([]);

            var x = d3.scaleBand()
                .domain(['Traditionalists','Baby Boomers','Generation X','Millenials'])
                .range([0,xRange])
            var xAxis = d3.axisBottom(x);

            chartGroup.append("g")
            .attr("class","axis y")
            .attr("transform","translate("+(margin.left)+",0)")
            .style("font-size","1.5vw")
            .call(yAxis)
            
            chartGroup.append("g")
            .attr("class","axis x")
            .attr("transform","translate("+(margin.left)+"," + yRange + ")")
            .style("font-size","1.5vw")
            .call(xAxis)
            
            color = d3.scaleOrdinal().range(['grey','darkgrey','lightgrey','whitesmoke','hotpink','limegreen','steelblue']);

            color.domain(zKeys);

            chartGroup.append("g")
                .selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("fill", function(d){return color(d.key);})
                .attr("opacity",.8)
                .attr("class",function(d){return "bar "+"bar"+d.key.substring(0,3);})
                .selectAll("rect")
                .data(function(d) { return d; })
                .enter().append("rect")
                .attr("class",function(d){return d.data.Generation; })
                .attr("x", function(d) { return x(d.data.Generation); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth())
                .attr("transform","translate("+(margin.left)+",0)")
                
            chartGroup.append("g")
                .selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("class",function(d){return "label "+"label"+d.key.substring(0,3);})
                .selectAll("text")
                .data(function(d){ return d; })
                .enter().append("text")
                .attr("class",function(d,i){return "labelGen "+"label"+d.data.Generation})
                .style("font-family","sans-serif")
                .attr("opacity",0)
                .text(function(d) { return ((d[1] - d[0])*100).toFixed(1)+"%"; })
                .attr("x",function(d) { return x(d.data.Generation); })
                .attr("y", function(d) { return y(d[1]); })
                .attr("transform","translate("+((margin.left)+(xRange/8))+",0)");

        ; break;
        case 2:  // expand y axis to show all categories

            var y = d3.scaleLinear()
                .domain([0,1])
                .range([yRange,50])
            var yAxis = d3.axisLeft(y)
                .tickFormat(formatPercent)
                .tickValues(['.25','.50','.75','1']);

            chartGroup.select(".y")
                .transition()
                .call(yAxis)

            chartGroup.selectAll("rect")
                .transition()
                .attr("y",function(d){return y(d[1]);})
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })

            chartGroup.selectAll(".label, .labelGen")
                .transition()
                .attr("y",function(d) { return y(d[1])+(y(d[0])-y(d[1]))/1.5; })
                .attr("opacity",.5)
    
            var dataL = 0;
            var offset = (xRange)/7;

            var legend = chartGroup.selectAll('.legend')
                    .data(zKeys)
                    .enter().append('g')
                    .attr("class", function(d){return "legend"+d.substring(0,3)})
                    .attr("transform", function (d, i) {
                    if (i === 0) {
                        dataL = d.length + offset 
                        return "translate(0,0)"
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
                .style("opacity",.8)
            
            legend.append('text')
                .attr("x", 20)
                .attr("y", 15)
            .text(function (d, i) { return d })
                .attr("class", "textselected")
                .style("text-anchor", "start")
                .style("font-size","1vw")

        ; break;
        case 3: // just Pharmacy

            chartGroup.selectAll(".bar")
            .transition()
            .attr("opacity",".2")

            chartGroup.selectAll(".label")
            .transition()
            .attr("opacity","0")

            chartGroup.selectAll(".barPha")
            .transition()
            .style("stroke","black")
            .style("stroke-width",".2vw")
            .attr("opacity","1")

            chartGroup.selectAll(".labelPha, .labelGen")
            .transition()
            .attr("opacity","1")
                
        ; break;
        case 4: // just home & building
        
            chartGroup.selectAll(".barPha")
            .transition()
            .style("stroke","none")
            .style("stroke-width","0")
            .style("z-index","-99999")
            .attr("opacity",".2")

            chartGroup.selectAll(".barFur")
            .transition()
            .style("stroke","black")
            .style("stroke-width",".2vw")
            .attr("opacity","1")

            chartGroup.selectAll(".labelPha")
            .transition()
            .attr("opacity","0")

            chartGroup.selectAll(".labelFur, .labelGen")
            .transition()
            .attr("opacity","1")

        ; break;
        case 5: // just boomers, gen x & millenials
            chartGroup.selectAll(".label")
                .transition()
                .attr("opacity","100%")

            chartGroup.selectAll(".bar")
                .transition()
                .style("stroke","none")
                .style("stroke-width","0")
                .attr("opacity",".5")
                .attr("transform","translate("+(0-(xRange/4))+")");

            chartGroup.selectAll(".label")
                .transition()
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
            chartGroup.selectAll(".Millenials")
                .transition()
                .style("opacity","80%")

            chartGroup.selectAll(".Generation")
                .transition()
                .attr("opacity","0")

            var x = d3.scaleBand()
                        .domain(['Millenials'])
                        .range([0,xRange*.25])
            var xAxis = d3.axisBottom(x);

            chartGroup.selectAll(".x")
                .transition()
                .call(xAxis)
                
            chartGroup.selectAll(".bar")
                .transition()
                .attr("transform","translate("+(0-(xRange*.75))+")")

            chartGroup.selectAll(".label")
                .transition()
                .attr("transform","translate("+(0-(xRange*.75))+")")
        ; break;
        case 7: // back to stacked area - group categories in experiential, misc & responsible?
            chartGroup.selectAll(".bar")
                .transition()
                .attr("transform","translate("+0+")")
                .style("opacity",.8)

            chartGroup.selectAll(".label")
                .transition()
                .attr("transform","translate("+0+")")

            chartGroup.selectAll(".Traditionalists")
                .transition()
                .style("opacity",1)

                chartGroup.selectAll(".Generation")
                    .transition()
                    .style("opacity",1)

            var x = d3.scaleBand()
                        .domain(['Traditionalists','Baby Boomers','Generation X','Millenials'])
                        .range([0,xRange])
            var xAxis = d3.axisBottom(x);

            chartGroup.selectAll(".x")
                .transition()
                .call(xAxis)
        ; break;
        case 8: // flip x axis

            var x = d3.scaleBand()
                        .domain(['Millenials','Generation X','Baby Boomers','Traditionalists'])
                        .range([0,xRange])
            var xAxis = d3.axisBottom(x);

            chartGroup.selectAll(".x")
                .transition()
                .call(xAxis)

            

            chartGroup.selectAll(".Millenials, .labelMillenials")
                .transition()
                .attr("x", x("Millenials"));

            chartGroup.selectAll(".Traditionalists, .labelTraditionalists")
                .transition()
                .attr("x", x("Traditionalists"));

            chartGroup.selectAll(".Baby, .labelBaby")
                .transition()
                .attr("x", x("Baby Boomers"));

            chartGroup.selectAll(".Generation, .labelGeneration")
                .transition()
                .attr("x", x("Generation X"));
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
