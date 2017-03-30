// Declare the global variables
var w = $(window).width();
var h = $(window).height();
var projection = d3.geo.mercator().scale(3500).center([-19.0208, 64.9631]);
var path = d3.geo.path().projection(projection);
var t = projection.translate(); // the projection's default translation
var s = projection.scale() // the projection's default scale
var iceland, map;

// timestampApis, timestampPriceChange, timestampPriceCheck

//Load in GeoJSON data
function loadGeoJSONData() {
    d3.json("/data/iceland.geojson", function (error, data) {
        if (error) {
            return console.error(error);
        }    
        initGeoVisualization(data);
    });
}

// Initialize the map of Iceland
function initGeoVisualization(data) {
    map = d3.select("#map").append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .call(d3.behavior.zoom().on("zoom", redraw));

    iceland = map.append("svg:g").attr("id", "iceland");

    iceland.selectAll("path")
        .data(data.features)
        .enter()
        .append("svg:path")
        .attr("d", path);
}

function showGasstations() {
    showHidePriceLabels('inline');
    initGasStations(gasStationsData);
}

function showEarthquakes() {
    showHidePriceLabels('none');
    removeGasstations();
    loadEarthquakes();
}

function showHidePriceLabels(value) {
    document.getElementById("pricelabels").style.display = value;
}

function removeGasstations() {
    gasStations.selectAll(".gasstations").remove();
}

function redraw() {
      // d3.event.translate (an array) stores the current translation from the parent SVG element
      // t (an array) stores the projection's default translation
      // we add the x and y vales in each array to determine the projection's new translation
      var tx = t[0] * d3.event.scale + d3.event.translate[0];
      var ty = t[1] * d3.event.scale + d3.event.translate[1];
      projection.translate([tx, ty]);

      // now we determine the projection's new scale, but there's a problem:
      // the map doesn't 'zoom onto the mouse point'
      projection.scale(s * d3.event.scale);

      // redraw the map
      iceland.selectAll("path").attr("d", path);
      earthquakes.selectAll("circle")
            .attr("cx", function (d) {
                return projection([d.longitude, d.latitude])[0];
            }).attr("cy", function (d) {
                return projection([d.longitude, d.latitude])[1];
            }).attr("r", function(d){
                return rScale(d.size);
      });
}