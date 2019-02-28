
var margin = { top: 20, right: 20, bottom: 60, left: 50 };

var mainwidth = (window.innerWidth - margin.left - margin.right),
	mainheight = (window.innerHeight*.6) - margin.top - margin.bottom;

var svg = d3.select(".mainviz").append("svg")
.attr("class","container")
.attr("width", mainwidth + margin.left + margin.right)
.attr("height", mainheight + margin.top + margin.bottom);

var chartGroup = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select(".scroll__graphic").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position","absolute")
    .style("text-align","center")
    .style("background","whitesmoke")
    .style("padding","8px")
    .style("border-radius","8px")
    .style("pointer-events","none");

    var parseDate = d3.timeParse("%d/%m/%Y");

    var formatDate = d3.timeFormat("%b '%y")

d3.csv('https://query.data.world/s/gll3zvqrc2rutcsme5skjtwvl4mxqr',function(data){
    data.forEach (function(d) {
        d.Date = parseDate(d.Date),
        d.manualBikes = parseInt(d['Manual Bikes'])||0,
        d.eBikes = parseInt(d['e-Bikes'])||0,
        d.grossValueAdded = parseInt(d['Gross Value Added'])||0
    })
    data.sort(function(d,f){
        return d3.ascending(d.Date,f.Date)
    })
    console.log(data)
    
    nestData = d3.nest()
    .key(function(d){return d.Date;})
    .rollup(function(leaves){return{
        gva : d3.sum(leaves, function(d){return d.grossValueAdded}),
        manualVA : d3.sum(leaves, function(d){return (d.manualBikes/(d.manualBikes+d.eBikes)) * d.grossValueAdded ;}),
        ebikeVA : d3.sum(leaves, function(d){return (d.eBikes/(d.manualBikes+d.eBikes)) * d.grossValueAdded ;})
    }
    })
    .entries(data)
    .map(function(d){return{
        Date : d.key,
        // grossValueAdded : d.value.gva.toLocaleString("en", {style: "currency",currency: "USD",minimumFractionDigits:0}),
        grossValueAdded : d.value.gva,
        manVA : d.value.manualVA,
        // manVA : d.value.manualVA.toLocaleString("en", {style: "currency",currency: "USD",minimumFractionDigits:0}),
        eVA : d.value.ebikeVA,
        // manVA : d.value.ebikeVA.toLocaleString("en", {style: "currency",currency: "USD",minimumFractionDigits:0})
    }})
    console.log('Nested:',nestData)

    var y = d3.scaleLinear()
    .domain([d3.min(nestData, function(d){return d.grossValueAdded}),d3.max(nestData, function(d){return d.grossValueAdded})])
    .range([mainheight, 0]);

    var yAxis = d3.axisLeft(y).tickFormat(d3.format("$.2s"));

    var x = d3.scaleBand()
    .domain(data.map(function(d){return d.Date;}))
    .range([0, mainwidth - margin.left - margin.right])

    var xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%b '%y"));

    chartGroup.append("g")
    .attr("class","axis y")
    .attr("transform","translate("+(margin.left*1.05)+",0)")
    .call(yAxis)

    chartGroup.append("g")
    .attr("class","axis x")
    .attr("transform","translate(" + (margin.left*1.05) + "," + mainheight + ")")
    .call(xAxis)


;})