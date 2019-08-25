var container = d3.select("#staticBody");

var margin = { top: window.innerWidth * 0.14, right: 80, bottom: 60, left: 80 };

container
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("text-align", "center")
  .style("background", "whitesmoke")
  .style("padding", "8px")
  .style("border-radius", "8px")
  .style("pointer-events", "none")
  .style("z-index", "9999");

container.append("svg").attr("class", "chart");

var tooltip = d3.select(".tooltip");
var formHolder = d3.select("#formholder");
var chartGroup = d3.select(".chart");

function handleResize() {
  var bodyWidth = Math.floor(window.innerWidth * 0.95);
  var bodyHeight = Math.floor(window.innerHeight * 0.8);

  minDim = Math.min(bodyWidth, bodyHeight);

  yRange = minDim;
  xRange = minDim;

  var chartMargin = 5;
  chartWidth = xRange - chartMargin;

  chartGroup
    .style("width", chartWidth + "px")
    .style("height", bodyHeight + "px");
}
d3.csv(
  "https://raw.githubusercontent.com/Jasparr77/hobby-dataviz-d3/master/songShape/output/SevenNationArmy.csv",
  function(data) {
    console.log(data);
    handleResize();

    var x = d3
      .scaleLinear()
      .domain([-9, 9])
      .range([0, xRange]);

    var y = d3
      .scaleLinear()
      .domain([-9, 9])
      .range([yRange, 0]);

    var songPath = d3
      .line()
      .curve(d3.curveNatural)
      .x(function(d) {
        return x(d.value["x"]);
      })
      .y(function(d) {
        return y(d.value["y"]);
      });

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    anglePrep = function(d) {
      return (d / 180) * Math.PI;
    };

    var pointData = d3
      .nest()
      .key(function(d) {
        return d[""];
      })
      .rollup(function(leaves) {
        return {
          x: d3.sum(leaves, function(d) {
            return Math.sin(anglePrep(d["angle"])) * d["octave"];
          }), // x coordinate for note
          y: d3.sum(leaves, function(d) {
            return Math.cos(anglePrep(d["angle"])) * d["octave"];
          }), // y coordinate for note
          channel: d3.max(leaves, function(d) {
            return Number(d["channel"]);
          }),
          time: d3.max(leaves, function(d) {
            return Number(d["note_seconds"]);
          })
        };
      })
      .entries(data);

    var lineData = d3
      .nest()
      .key(function(d) {
        return d["channel_chunk"];
      })
      .key(function(d) {
        return d[""];
      })
      .rollup(function(leaves) {
        return {
          x: d3.sum(leaves, function(d) {
            return Math.sin(anglePrep(d["angle"])) * d["octave"];
          }), // x coordinate for note
          y: d3.sum(leaves, function(d) {
            return Math.cos(anglePrep(d["angle"])) * d["octave"];
          }), // y coordinate for note
          channel: d3.max(leaves, function(d) {
            return Number(d["channel"]);
          }),
          time: d3.max(leaves, function(d) {
            return Number(d["note_seconds"]);
          })
        };
      })
      .entries(data);

    console.log(lineData);

    var noteData = [
      { note_name: "C", angle: 0 },
      { note_name: "G", angle: 30 },
      { note_name: "D", angle: 60 },
      { note_name: "A", angle: 90 },
      { note_name: "E", angle: 120 },
      { note_name: "B", angle: 150 },
      { note_name: "F#", angle: 180 },
      { note_name: "C#", angle: 210 },
      { note_name: "G#", angle: 240 },
      { note_name: "D#", angle: 270 },
      { note_name: "A#", angle: 300 },
      { note_name: "F", angle: 330 }
    ];

    lastRecord = data.length - 1;

    chartGroup;
    //   .selectAll(".notePoint")
    //   .data(noteData)
    //   .enter()
    //   .append("text")
    //   .attr("class", "notePoint")
    //   .attr("dy", ".31em")
    //   .attr("x", function(d) {
    //     return x(Math.sin(anglePrep(d["angle"])) * 8);
    //   })
    //   .attr("y", function(d) {
    //     return y(Math.cos(anglePrep(d["angle"])) * 8);
    //   })
    //   .text(function(d) {
    //     return d["note_name"];
    //   });

    //   shapes
    chartGroup
      .selectAll(".line")
      .data(lineData)
      .enter()
      .append("path")
      .attr("class", function(d) {
        return d["key"] + " songPath";
      })
      .attr("d", function(d) {
        return songPath(d.values);
      })
      .attr("fill", function(d) {
        return color(Number(d["key"].substring(0, 2)));
      })
      .attr("fill-opacity", 0.0)
      .attr("stroke", function(d) {
        return color(Number(d["key"].substring(0, 2)));
      })
      .attr("stroke-opacity", 0.05)
      .attr("stroke-width", ".05vw");

    // chartGroup
    //   .selectAll(".circleFifths")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "circleFifths")
    //   .attr("cx", x(0))
    //   .attr("cy", y(0))
    //   .attr("r", function(d) {
    //     return y(Number(d["octave"] + 2));
    //   })
    //   .attr("fill", "none")
    //   .attr("stroke", "white")
    //   .attr("opacity", 1)
    //   .attr("stroke-width", ".02vw");

    //   dots
    chartGroup;
    //   .selectAll(".noteCircle")
    //   .data(pointData)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "noteCircle")
    //   .attr("cx", function(d) {
    //     return x(d.value["x"]);
    //   })
    //   .attr("cy", function(d) {
    //     return y(d.value["y"]);
    //   })
    //   .attr("r", ".15vw")
    //   .attr("fill", function(d) {
    //     return color(d.value["channel"]);
    //   })
    //   .attr("fill-opacity", "0")
    //   .attr("stroke", "none")
    //   .transition()
    //   .delay(function(d) {
    //     return d.value["time"] * 1000;
    //   })
    //   .attr("fill-opacity", 0.6)
    //   .attr("stroke", "white")
    //   .attr("stroke-width", ".04vw")
    //   .attr("r", ".3vw")
    //   .transition()
    //   .attr("fill-opacity", "0")
    //   .attr("stroke", "none")
    //   .attr("r", ".2vw");
  }
);
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
