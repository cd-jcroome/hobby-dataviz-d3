const scroller = scrollama();

var container = d3.select('#scroll');
var graphic = container.select('.scroll__graphic');
var chart = graphic.select('.chart');
var chart2 = chart.select('.chart2');
var text = container.select('.scroll__text');
var step = text.selectAll('.step');

var margin = { top: 20, right: 20, bottom: 60, left: 50 };

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
    .html("<h1>UK Bicycle imports 2010 - 2016</h1>")
    .style("height",stepHeight +"px");
        
text.append("div")
    .attr("class", "step")
    .attr("data-step", "b")
    .html("<h2>Bicycle imports in the UK were down or flat from 2010 - 2016, regardless of season.</h2>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "c")
    .html("<h2>Looking at Manual Bikes specifically, all four seasons were trending down over that same seven year time-span.</h2>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "d")
    .html("<h2>e-Bikes, however seem to be on the up & up.</h2>")
    .style("height",stepHeight +"px");

text.append("div")
    .attr("class", "step")
    .attr("data-step", "e")
    .html("<h2>Since this data stops in 2016, we can only guess how imports have performed over the past 3 years.</h2>")
    .style("height",stepHeight +"px");

    var parseDate = d3.timeParse("%d/%m/%Y");
    var formatYear = d3.timeFormat("%Y");
    var formatMonth = d3.timeFormat("%m")
    var formatDate = d3.timeFormat("%b '%y");


var tooltip = d3.select(".tooltip");

function handleResize() {
    // 1. update height of step elements (moved to divs)

    // 2. update width/height of graphic element
    var bodyWidth = d3.select('body').node().offsetWidth;
    var textWidth = text.node().offsetWidth;

    var graphicWidth = bodyWidth - textWidth;

    graphic
        .style('width', graphicWidth + 'px')
        .style('height', window.innerHeight*.5 + 'px');

    var chartMargin = 5;
    var chartWidth = graphic.node().offsetWidth - chartMargin;

    chart
        .style('width', chartWidth + 'px')
        .style('height', Math.floor(window.innerHeight / 2) + 'px');

    chart2
        .style('width', chartWidth + 'px')
        .style('height', Math.floor(window.innerHeight / 2) + 'px');

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
}

function getTransformData() {
    d3.csv('https://query.data.world/s/gll3zvqrc2rutcsme5skjtwvl4mxqr',function(data){
        data.forEach (function(d) {
            switch ( formatMonth(parseDate(d['Date']))){
                case '01': d.quarter = 'Q1'; break;
                case '04': d.quarter = 'Q2'; break;
                case '07': d.quarter = 'Q3'; break;
                case '10': d.quarter = 'Q4'; break;
            }
            d.year = formatYear(parseDate(d['Date'])),
            d['Date'] = parseDate(d['Date']),
            d['Manual Bikes'] = parseInt(d['Manual Bikes'])||0,
            d['e-Bikes'] = parseInt(d['e-Bikes'])||0,
            d['Gross Value Added'] = parseInt(d['Gross Value Added'])||0
        })
        data.sort(function(d,f){
            return d3.ascending(d.Date,f.Date)
        })
        console.log('Raw Data:',data)
        
        nestData = d3.nest()
        .key(function(d){return d.quarter;})
        .key(function(d){return d.year})
        .rollup(function(leaves){return{
            manual : d3.sum(leaves, function(d){return d['Manual Bikes'];}),
            ebike : d3.sum(leaves, function(d){return d['e-Bikes'];}),
            gva: d3.sum(leaves, function(d){return d['Gross Value Added']})
            }
        })
        .entries(data)
        console.log('Nested:',nestData)
        
        nestData.nestData = nestData
        
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

            graphic.append("text")
                .attr("class","title")
                .style("position","absolute")
                .style("top","50%")
                .style("right","50%")
                .style("font-size","2vw")
                .style("font-color","black")
                .text("Scroll down for charts!")
        ;break;
        case 1: // gross value added
            chartGroup.selectAll(".line").remove()
            chartGroup.selectAll(".circle").remove()
            chartGroup.selectAll(".axis").remove()

            data = dict.data

            var y = d3.scaleLinear()
            .domain([(d3.min(dict.data, function(d){return d['Gross Value Added']})*.9),(d3.max(dict.data, function(d){return d['Gross Value Added']})*1.1)])
            .range([(Math.floor(window.innerHeight / 2))*.95,0]);
        
            var yAxis = d3.axisLeft(y).tickFormat(d3.format("$.2s"));
        
            var x = d3.scaleBand()
            .domain(dict.data.map(function(d){return d['year'];}))
            .range([0, (graphic.node().offsetWidth -5)*.95])
        
            var xAxis = d3.axisBottom(x);
            
            chartGroup.append("g")
            .attr("class","axis y")
            .attr("transform","translate("+(margin.left)+",0)")
            .call(yAxis)
        
            chartGroup.append("g")
            .attr("class","axis x")
            .attr("transform","translate(0," + (Math.floor(window.innerHeight / 2))*.95 + ")")
            .call(xAxis)

            var gvaLine = d3.line()
                .x(function(d) {return x(d.key);})
                .y(function(d) {return y(d.value.gva);})
                .curve(d3.curveNatural);

            graphic.selectAll(".title").transition()
                .text("Gross Value Added")
                .style("top","0%")
                .style("font-size","1.5vw")

            chartGroup.selectAll(".line")
            .data(nestData)
            .enter().append("path")
                .attr("class",function(d){return d.key+" line"+" gva";})
                .attr("d",function(d){ return gvaLine(d.values);})
                .attr("fill","none")
                .attr("stroke-width",".5vw")
                .attr("opacity",.6)
                .attr("transform","translate("+(margin.left)+",0)")
            .on("mouseover",function(d){
                    d3.select(this)
                    .attr("r","2vw")
                    .attr("opacity",1)
                    .attr("stoke-width","1vw");
                    tooltip.transition().duration(600).style("opacity", .95);
                    tooltip.html(d.key+" Manual imports")
                        .style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
                })
            .on("mouseout", function() {
                    d3.select(this)
                    .attr("r",".6vw")
                    .attr("opacity",.6);
                    tooltip.transition().duration(800).style("opacity", 0);
                });
            
            chartGroup.selectAll(".circle")
            .data(data)
            .enter().append("circle")
                .attr("cx", function(d){ return x(d.year) ;})
                .attr("cy", function(d){ return y(d['Gross Value Added']) ;})
                .attr("fill","purple")
                .attr("class",function(d){return d.quarter+" circle"+" gva";})
                .attr("r", ".5vw")
                .attr("stroke","white")
                .attr("stroke-width", ".1vw")
                .attr("opacity",.5)
                .attr("transform","translate("+(margin.left)+",0)")
            .on("mouseover", function(d) {
                d3.select(this)
                .attr("r","2vw")
                .attr("stroke","black")
                .attr("stoke-width",".2vw")
                .style("opacity",1)
                tooltip.transition().duration(600).style("opacity", .95);
                tooltip.html(d.quarter + " Manual Imports<br/>"
                + d.year +": " + d['Manual Bikes'].toLocaleString("en", {style: "decimal"})
                ).style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY - 28) + "px");
            })// fade out tooltip on mouse out               
            .on("mouseout", function() {
                d3.select(this)
                .attr("r",".5vw")
                .style("opacity",.5);
                tooltip.transition().duration(500).style("opacity", 0);
            });
            chartGroup.selectAll(".Q1").attr("stroke","steelblue")
            chartGroup.selectAll(".Q2").attr("stroke","lightblue")
            chartGroup.selectAll(".Q3").attr("stroke","blue")
            chartGroup.selectAll(".Q4").attr("stroke","navy")
        ; break;
        case 2: // manual bike imports

            graphic.selectAll(".title").transition()
                .text("Manual Bike Imports (units)")

            data = dict.data
            var y = d3.scaleLinear()
            .domain([(d3.min(data, function(d){return d['Manual Bikes']})*.9),(d3.max(data, function(d){return d['Manual Bikes']})*1.1)])
            .range([(Math.floor(window.innerHeight / 2))*.95, 0]);
        
            var yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));
        
            var x = d3.scaleBand()
            .domain(['2010','2011','2012','2013','2014','2015','2016'])
            .range([0, (graphic.node().offsetWidth -5)*.95])
        
            var xAxis = d3.axisBottom(x);
            
            chartGroup.select(".y")
                .transition()
                .call(yAxis)
        
            chartGroup.select(".x")
                .transition()
                .call(xAxis)
        
            var manLine = d3.line()
                .x(function(d) {return x(d.key);})
                .y(function(d) {return y(d.value.manual);})
                .curve(d3.curveNatural);
        
            chartGroup.selectAll(".line")
            .data(nestData).transition()
                .attr("d",function(d){ return manLine(d.values);})
                .attr("class",function(d){ return d['quarter']+" line"+" manual"; })
        
            chartGroup.selectAll(".circle").transition()
                .attr("cy", function(d){ return y(d['Manual Bikes']) ;})
                .attr("fill","brown")
                .attr("class",function(d){ return d['quarter']+" circle"+" manual"; })
        ; break;
        case 3:  // ebike imports
            
            chartGroup.selectAll(".ebike").remove()

            graphic.selectAll(".title").transition()
                .text("E-Bike Imports (units)")

            data = dict.data

            var y = d3.scaleLinear()
            .domain([0,(d3.max(data, function(d){return d['e-Bikes']})*1.1)])
            .range([(Math.floor(window.innerHeight / 2))*.95, 0]);
        
            var yAxis = d3.axisLeft(y).tickFormat(d3.format(".2s"));
        
            var x = d3.scaleBand()
            .domain(['2010','2011','2012','2013','2014','2015','2016'])
            .range([0, (graphic.node().offsetWidth -5)*.95])
        
            var xAxis = d3.axisBottom(x);
                
            chartGroup.select(".y")
                .transition()
                .call(yAxis)
        
            chartGroup.select(".x")
                .transition()
                .call(xAxis)
        
            var eLine = d3.line()
                .x(function(d) {return x(d.key);})
                .y(function(d) {return y(d.value.ebike);})
                .curve(d3.curveNatural);
        
            chartGroup.selectAll(".line").transition()
                .attr("d",function(d){ return eLine(d.values);})
                .attr("class",function(d){ return d['quarter']+" line"+" ebike"; })
            
            chartGroup.selectAll(".circle").transition()
                .attr("cy", function(d){ return y(d['e-Bikes']) ;})
                .attr("cx", function(d){ return x(d['year'])})
                .attr("fill","salmon")
                .attr("class",function(d){ return d['quarter']+" circle"+" ebike"; })
        ; break;
        case 4: // expand years to 2019, add question marks?

            graphic.selectAll(".title").transition()
                .text("Manual & E-Bike Imports (units)")

            data = dict.data
            var yAll = d3.scaleLinear()
            .domain([0,(d3.max(data, function(d){return d['Manual Bikes']})*1.1)])
            .range([(Math.floor(window.innerHeight / 2))*.95, 0]);
        
            var yAxis = d3.axisLeft(yAll).tickFormat(d3.format(".2s"));
        
            var xAll = d3.scaleBand()
            .domain(['2010','2011','2012','2013','2014','2015','2016','2017','2018'])
            .range([0, (graphic.node().offsetWidth -5)*.95])
        
            var xAxis = d3.axisBottom(xAll);
                
            chartGroup.select(".y")
                .transition()
                .call(yAxis)
        
            chartGroup.select(".x")
                .transition()
                .call(xAxis)
        
            var manLine = d3.line()
                .x(function(d) {return xAll(d.key);})
                .y(function(d) {return yAll(d.value.manual);})
                .curve(d3.curveNatural);
            
            var eLine = d3.line()
                .x(function(d) {return xAll(d.key);})
                .y(function(d) {return yAll(d.value.ebike);})
                .curve(d3.curveNatural);
            
            chartGroup.selectAll(".line").transition()
                .attr("d",function(d){ return eLine(d.values);})
            
            chartGroup.selectAll(".circle").transition()
                .attr("cx", function(d){ return xAll((d.year)) ;})
                .attr("cy", function(d){ return yAll(d['e-Bikes']) ;})
                .attr("class","ebike")

            chartGroup.selectAll(".manual .line")
            .data(nestData)
            .enter().append("path")
                .attr("class",function(d){return d.key+" manual line";})
                .attr("d",function(d){ return manLine(d.values);})
                .attr("fill","none")
                .attr("stroke-width",".5vw")
                .attr("opacity",.6)
                .attr("transform","translate("+(margin.left)+",0)")
            .on("mouseover",function(d){
                d3.select(this)
                .attr("r","2vw")
                .attr("opacity",1)
                .attr("stoke-width","1vw");
                tooltip.transition().duration(600).style("opacity", .95);
                tooltip.html(d.key+" Manual Imports")
                    .style("left", (d3.event.pageX - textWidth) + "px").style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(this)
                .attr("r",".6vw")
                .attr("opacity",.6);
                tooltip.transition().duration(800).style("opacity", 0);
            });
        
            chartGroup.selectAll(".manual .circle")
            .data(data)
            .enter().append("circle")
                .attr("cx", function(d){ return xAll(d.year) ;})
                .attr("cy", function(d){ return yAll(d['Manual Bikes']) ;})
                .attr("fill","brown")
                .attr("class",function(d){return d.quarter+" manual circle";})
                .attr("r", ".5vw")
                .attr("stroke","white")
                .attr("stroke-width", ".1vw")
                .attr("opacity",.5)
                .attr("transform","translate("+(margin.left)+",0)")
            .on("mouseover", function(d) {
                d3.select(this)
                .attr("r","2vw")
                .attr("stroke","black")
                .attr("stoke-width",".2vw")
                .style("opacity",1)
                tooltip.transition().duration(600).style("opacity", .95);
                tooltip.html(d.quarter + " Manual Imports<br/>"
                + d.year +": " + d['Manual Bikes'].toLocaleString("en", {style: "decimal"})
                ).style("left", (d3.event.pageX - textWidth) + "px").style("top", (d3.event.pageY - 28) + "px");
            })// fade out tooltip on mouse out               
            .on("mouseout", function() {
                d3.select(this)
                .attr("r",".5vw")
                .style("opacity",.5);
                tooltip.transition().duration(500).style("opacity", 0);
            });
         
            chartGroup.selectAll(".Q1").attr("stroke","steelblue")
            chartGroup.selectAll(".Q2").attr("stroke","lightblue")
            chartGroup.selectAll(".Q3").attr("stroke","blue")
            chartGroup.selectAll(".Q4").attr("stroke","navy")
        ; break;
        // case 5: //specialized ebike ad
        // chartGroup.selectAll(".manual").remove()
        // chartGroup.selectAll(".gva").remove()
        // chartGroup.selectAll(".ebike").remove()
        // chartGroup.selectAll(".all").remove()
        // chartGroup.selectAll("g").remove()
        // graphic.selectAll(".title").remove()

        // chartGroup.append("foreignObject")
        // .attr("class","video")
        // .html("<iframe width=\"560\" height=\"315\" src=\"https://www.youtube.com/embed/sJETokbfnNI\" frameborder=\"0\" allow=\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\" allowfullscreen></iframe>")
        
        // ; break;
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
