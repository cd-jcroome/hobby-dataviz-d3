var container = d3.select("#staticBody");

var margin = { top: window.innerWidth * 0.14, right: 80, bottom: 60, left: 80 };

container.append("svg").attr("class", "chart");

var tooltip = d3.select(".tooltip");
var formHolder = d3.select("#formholder");
var chartGroup = d3.select(".chart");

function handleResize() {
  bodyWidth = Math.floor(window.innerWidth * 0.95);
  bodyHeight = Math.floor(window.innerHeight * 0.8);

  minDim = Math.min(bodyWidth, bodyHeight);

  yRange = minDim / 1.25;
  xRange = minDim / 1.25;

  chartGroup.style("width", xRange + "px").style("height", yRange + 40 + "px");

  div = d3
    .select("#staticBody")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style("position", "absolute")
    .style("text-align", "center")
    .style("background", "whitesmoke")
    .style("padding", "8px")
    .style("border-radius", "8px")
    .style("pointer-events", "none");
}
d3.csv(
  "https://raw.githubusercontent.com/Jasparr77/hobby-dataviz-d3/master/songShape/" +
    "output/SevenNationArmy.csv",
  function(data) {
    console.log(data);
    handleResize();

    var x = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([0, xRange]);

    var y = d3
      .scaleLinear()
      .domain([-1, 1])
      .range([yRange, 0]);

    var timeLength = data[data.length - 1]["note_seconds"];

    var songPath = d3
      .line()
      .curve(d3.curveNatural)
      .x(function(d) {
        return x(d.value["x"]);
      })
      .y(function(d) {
        return y(d.value["y"]);
      });
    var instruments = d3.json(
      "https://raw.githubusercontent.com/Jasparr77/hobby-dataviz-d3/dev/songShape/noteData.json", function(metaData)
    {
      instruments = metaData["instrument names"]
      var colorList = ["#aec934",
      "#9159de",
      "#77bf3a",
      "#4667e6",
      "#51cb5e",
      "#9b40b5",
      "#359f34",
      "#cb6ae3",
      "#82a51c",
      "#8475ef",
      "#b8b733",
      "#3c4dbb",
      "#e6a01e",
      "#4c7ff1",
      "#d9b637",
      "#6243b2",
      "#75b150",
      "#bd31a2",
      "#4bb871",
      "#ea59ba",
      "#5e8d26",
      "#7a55c3",
      "#a3bf60",
      "#385fcb",
      "#e38421",
      "#4691eb",
      "#ea6e2e",
      "#554baa",
      "#de9b36",
      "#9e7ee9",
      "#767c16",
      "#da68c9",
      "#357226",
      "#c12d8d",
      "#53cd98",
      "#e83889",
      "#479046",
      "#d584e5",
      "#445a06",
      "#76409a",
      "#a88f25",
      "#6168c5",
      "#b77f1e",
      "#3e6cba",
      "#c73e16",
      "#3ccde4",
      "#dc3f30",
      "#4cd2c3",
      "#e73667",
      "#3c9e81",
      "#d5334a",
      "#36b1da",
      "#b45618",
      "#5caee2",
      "#ad3b26",
      "#3aadb2",
      "#ef6456",
      "#2b5a9b",
      "#e5ad53",
      "#644999",
      "#9c9f44",
      "#8f63bb",
      "#576c1c",
      "#9d91e8",
      "#8d6c12",
      "#505099",
      "#ceb863",
      "#9e4793",
      "#8db773",
      "#af3274",
      "#428f5c",
      "#ca436c",
      "#7ec095",
      "#e072af",
      "#235e31",
      "#ec6c93",
      "#115e41",
      "#cc85ce",
      "#788c3b",
      "#7a488d",
      "#b9b676",
      "#6f64a6",
      "#df8e50",
      "#377cb1",
      "#a86828",
      "#829fdd",
      "#9a4f20",
      "#6a77b1",
      "#5b5b10",
      "#987dc0",
      "#7b7a30",
      "#d5a0d8",
      "#415a1f",
      "#ab699a",
      "#367042",
      "#9d3757",
      "#226a4d",
      "#bd4b4d",
      "#2f7b63",
      "#d77452",
      "#4a5589",
      "#ae8c49",
      "#8b4772",
      "#536c31",
      "#e58d9e",
      "#525620",
      "#ea8a7b",
      "#646831",
      "#bb6272",
      "#7c8a4f",
      "#8d4a57",
      "#695711",
      "#dfa777",
      "#704b0c",
      "#a95b4b",
      "#847037",
      "#874327",
      "#ab7950",
      "#8b6325",
      "#895a33"]
    var color = d3
      .scaleOrdinal()
      .domain(instruments)
      .range(colorList)

    var opacity = d3
      .scaleOrdinal()
      .domain(instruments)
      .range([".3", ".3", ".3", ".3", "0"]);

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

    anglePrep = function(d) {
      return (d / 180) * Math.PI;
    };

    var pointData = d3
      .nest()
      .key(function(d) {
        return d[""] + "|" + d["instrument"];
      })
      .rollup(function(leaves) {
        return {
          x: d3.sum(leaves, function(d) {
            return (
              // Math.sin(anglePrep(d["angle"])) * (1 - 0.1 * Number(d["octave"]))
              Math.sin(anglePrep((d["note_seconds"] / timeLength) * 360)) *
              (d["note_midi_value"] / 84)
            );
          }), // x coordinate for note
          y: d3.sum(leaves, function(d) {
            return (
              // Math.cos(anglePrep(d["angle"])) * (1 - 0.1 * Number(d["octave"]))
              Math.cos(anglePrep((d["note_seconds"] / timeLength) * 360)) *
              (d["note_midi_value"] / 84)
            );
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
        return d["instrument"];
      })
      .key(function(d) {
        return d[""];
      })
      .rollup(function(leaves) {
        return {
          x: d3.sum(leaves, function(d) {
            return (
              // Math.sin(anglePrep(d["angle"])) * (1 - 0.1 * Number(d["octave"]))
              Math.sin(anglePrep((d["note_seconds"] / timeLength) * 360)) *
              (d["note_midi_value"] / 84)
            );
          }), // x coordinate for note
          y: d3.sum(leaves, function(d) {
            return (
              // Math.cos(anglePrep(d["angle"])) * (1 - 0.1 * Number(d["octave"]))
              Math.cos(anglePrep((d["note_seconds"] / timeLength) * 360)) *
              (d["note_midi_value"] / 84)
            );
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

    lastRecord = data.length - 1;

    // chartGroup
    //   .selectAll(".notePoint")
    //   .data(noteData)
    //   .enter()
    //   .append("text")
    //   .attr("class", "notePoint")
    //   .attr("dy", ".31em")
    //   .attr("x", function(d) {
    //     return x(Math.sin(anglePrep(d["angle"])) * 0.95);
    //   })
    //   .attr("y", function(d) {
    //     return y(Math.cos(anglePrep(d["angle"])) * 0.95);
    //   })
    //   .text(function(d) {
    //     return d["note_name"];
    //   });
    // // add circles

    // chartGroup
    //   .selectAll(".circleFifths")
    //   .data(data)
    //   .enter()
    //   .append("circle")
    //   .attr("class", "circleFifths")
    //   .attr("cx", x(0))
    //   .attr("cy", y(0))
    //   .attr("r", function(d) {
    //     return (xRange / 2) * (1 - 0.1 * Number(d["octave"]));
    //   })
    //   .attr("fill", "none")
    //   .attr("text", function(d) {
    //     return d["octave"];
    //   })
    //   .attr("stroke", "lightgrey")
    //   .attr("opacity", 1)
    //   .attr("stroke-width", ".02vw");

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
        return color(d["key"]);
      })
      .attr("fill-opacity", 0)
      .attr("stroke", function(d) {
        return color(d["key"]);
      })
      .attr("stroke-opacity", function(d) {
        return opacity(d["key"]);
      })
      .attr("stroke-width", ".25vw");
    // .on("mouseover", function(d) {
    //   d3.select(this)
    //     .attr("stroke-opacity", 0.8)
    //     .attr("stroke-width", "1vw");
    //   div
    //     .transition()
    //     .duration(400)
    //     .style("opacity", 0.9);
    //   div
    //     .html(d["key"])
    //     .style("left", d3.event.pageX - margin.left + "px")
    //     .style("top", d3.event.pageY - margin.bottom + "px");
    // })
    // .on("mouseout", function(d) {
    //   d3.select(this)
    //     .attr("stroke-opacity", function(d) {
    //       return opacity(d["key"]);
    //     })
    //     .attr("stroke-width", ".25vw");
    //   div
    //     .transition()
    //     .duration(400)
    //     .style("opacity", 0);
    // });

    // dots
    //   chartGroup
    //     .selectAll(".noteCircle")
    //     .data(pointData)
    //     .enter()
    //     .append("circle")
    //     .attr("class", "noteCircle")
    //     .attr("cx", function(d) {
    //       return x(d.value["x"]);
    //     })
    //     .attr("cy", function(d) {
    //       return y(d.value["y"]);
    //     })
    //     .attr("r", ".3vw")
    //     .attr("fill", function(d) {
    //       return color(d["key"]);
    //     })
    //     .attr("fill-opacity", 0.2)
    //     .attr("stroke", "none")
    //     .transition()
    //     .delay(function(d) {
    //       return d.value["time"] * 1000;
    //     })
    //     .attr("fill-opacity", 1)
    //     .attr("stroke", "white")
    //     .attr("stroke-width", ".04vw")
    //     .attr("r", ".4vw")
    //     .transition()
    //     .attr("fill-opacity", "0")
    //     .attr("stroke", "none")
    //     .attr("r", ".2vw");
  });
  }
);
// https://math.stackexchange.com/questions/260096/find-the-coordinates-of-a-point-on-a-circle
