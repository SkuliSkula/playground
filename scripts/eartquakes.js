// Declare the global variables
var earthquakes, tipEq, earthquakeData, rScale;

//Load in GeoJSON data
function loadEarthquakes() {
    d3.json("http://apis.is/earthquake/is", function(error, json) {
        if(error)
            return console.error("Eartquakes data error: ", error);
        
        console.log(json);
        earthquakeData = json;
        initEartquakes(json);
    });  
}

function initEartquakes(json) {
    var dataset = json.results;
    earthquakes = map.append("svg:g").attr("id", "eartquakes");
    var sizeArray = dataset.map(function(d){
       return d.size; 
    });
    sizeArray = sizeArray.filter(function(d){
       return d > 0; 
    });
    tipEq = d3.tip().attr('class', 'd3-tip-eq')
        .offset([-10, 0])
        .html(function(d){
            var humanReadableLocation, depth, quality, size, timeStamp;
            var notFound = "No info";
            if(d.depth)
                depth = d.depth;
            else     
                depth = notFound;
            if(d.humanReadableLocation)
                humanReadableLocation = d.humanReadableLocation;
            else
                humanReadableLocation = notFound
            if(d.quality)
                quality = d.quality;
            else
                quality = notFound;
            if(d.size)
                size = d.size;
            else
                size = notFound;
            if(d.timestamp)
                timeStamp = d.timestamp;
            else
                timeStamp = notFound;

            return "<strong>" + "Location" + ": " + "</strong> <span style='color:red'>" + humanReadableLocation + "</span>"+ "<br>" +
                    "<strong>" + "Time" + ": " + "</strong> <span style='color:red'>" + timeStamp + "</span>"+ "<br>" +
                    "<strong>" + "Size" + ": " + "</strong> <span style='color:red'>" + size + "</span>"+ "<br>" +
                    "<strong>" + "Depth" + ": " + "</strong> <span style='color:red'>" + depth + "</span>"+ "<br>"+
                "<strong>" + "Quality" + ": " + "</strong> <span style='color:red'>" + quality + "</span>";
    });
    
    earthquakes.call(tipEq);
    // Create a scale for the eartquake size
    rScale = d3.scale.linear()
                .domain([0,d3.max(sizeArray)])
                .range([1,10]);
    
    earthquakes.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("cx", function (d) {
            return projection([d.longitude, d.latitude])[0];
        }).attr("cy", function (d) {
            return projection([d.longitude, d.latitude])[1];
        }).attr("r", function(d){
            if(+d.size<0)
                return 0.1
            else
                return rScale(+d.size);
        })
        .on('mouseover', tipEq.show).on('mouseout', tipEq.hide);
}