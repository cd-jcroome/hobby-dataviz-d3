var container = d3.select('#staticBody')

var margin = { top: (window.innerWidth*.14), right: 80, bottom: 60, left: 80 };

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

container.append('svg').attr('class','chart');

var tooltip = d3.select(".tooltip");
var formHolder = d3.select("#formholder");
var chartGroup = d3.select(".chart");

function handleResize() {
    var bodyWidth = (Math.floor(window.innerWidth*.95));
    var bodyHeight = (Math.floor(window.innerHeight*.80))
        
    minDim = Math.min(bodyWidth, bodyHeight)

    yRange = 600
    xRange = 1200

    var chartMargin = 5;
    chartWidth = xRange-chartMargin;

}
d3.csv('https://cdn.jsdelivr.net/gh/jasparr77/hobby-dataviz-d3/songShape/output/Hallelujah_group.csv', function(error, data){
    if (error) throw error;
    handleResize()

    console.log(data)

    var edgeSize = d3.scaleLinear()
        .domain([d3.min(data, function(d){return d['edge_count'];}),d3.max(data, function(d){return d['edge_count'];})])
        .range([.01,.05])

    var color = d3.scaleOrdinal(d3.schemeCategory20)

    var diameter  = minDim
    radius = diameter/2
    innerRadius = radius - 120;

    var cluster = d3.cluster()
        .size([360, innerRadius]);

    var line = d3.radialLine()
        .curve(d3.curveBundle.beta(0.85))
        .radius(function(d){return d.y;})
        .angle(function(d){return d.x / 180 * Math.PI});
    
    var root = packageHierarchy(data)
        .sum(function(d){return d['edge_count']; })


    cluster(root);

    root.leaves().forEach(function(d){
        d.x = Math.floor(d.data['angle'])+(30*((Math.floor(d.data['octave'])-4)/8))
    });

    chartGroup
        .attr("width",diameter)
        .attr("height",diameter)

    var link = chartGroup.append("g").attr("class","linkGroup").selectAll(".link"),
        node = chartGroup.append("g").attr("class","nodeGroup").selectAll(".node");
    
    console.log(packagePriors(root.leaves()))

    link = link
        .data(packagePriors(root.leaves()))
        .enter().append("path")
        .each(function(d){ d.source = d[0], d.target = d[d.length - 1]; })
        .attr("class","link")
        .attr("fill","none")
        // .attr("stroke",function(d){color(d[0].data['channel'])})
        .attr("stroke","salmon")
        .attr("stroke-opacity",".8")
        .attr("stroke-width",".05vw")
        .attr("d",line);

    d3.selectAll(".linkGroup").attr("transform","translate("+radius+","+radius+")");

    node = node
        .data(root.leaves())
        .enter().append("text")
            .attr("class","node")
            .attr("dy",".31em")
            .attr("transform",function(d){return "rotate("+(d.x-90)+")translate("+(d.y+8)+",0)"+(d.x > 180 ? "":"rotate(180)"); })
            .attr("text-anchor",function(d){return d.x > 180? "start" : "end"; })
            .text(function(d){return d.data.key; })
    
    d3.selectAll(".nodeGroup").attr("transform","translate("+radius+","+radius+")");


    function packageHierarchy(data){
        var map = {};

        function find(name,data){
            var node = map[name], i;
            if (!node) {
                node = map[name] = data || {name: name, children: []};
                if (name.length) {
                    node.parent = find(name.substring(0, i = name.lastIndexOf(".")))
                    node.parent.children.push(node);
                    node.key = name.substring(i+1);
                }
            }
            return node;
        }
        data.forEach(function(d) {
            find(Math.floor(d['octave'])+" "+d['note_name'],d);
        });

        return d3.hierarchy(map[""]);
    }

    function packagePriors(nodes){
        var map = {}
        priors = []
        channel = []
        nodes.forEach(function(d){
            map[d.data['octave']+" "+d.data['note_name']] = d;
        });
        nodes.forEach(function(d){
            if (d.data['octave']+" "+d.data['note_name'])
                d = [d]
                d.forEach(function(i){
                    priors.push(map[i.data['octave']+" "+i.data['note_name']].path(map[i.data['prior_octave']+" "+i.data['prior_note_name']]))
                    channel.push(i.data['channel'])
                })
                });
        return priors
    }
});
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle