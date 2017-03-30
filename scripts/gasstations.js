var gasStations, tipGas, timestampPriceChange, timestampPriceCheck;
var gasStationsData;

// timestampApis, timestampPriceChange, timestampPriceCheck

function loadGasStations() {
    d3.json("http://apis.is/petrol", function(error, json) {
        if(error)
            return console.error("Petrol data error: ", error);
        
        console.log(json);
        gasStationsData = json;
        initGasStations(json);
        setTimeStamps(json);
        setHighLowPrice(json);
    });
}

function initGasStations(json) {
    var dataset = json.results;
    var gasstationsnames = getGasstationsNames(json);
    gasStations = map.append("svg:g").attr("id", "gasstations");
    // Create the tooltip
    tipGas = d3.tip().attr('class', 'd3-tip-gas')
        .offset([-10, 0])
        .html(function(d) {
            var company, name, bensinPrice, bensinDiscountPrice, dieselPrice, dieselDiscountPrice;
            var notFound = "Not found";
    
            if(d.company)
                company = d.company;
            else     
                company = notFound;
            if(d.name)
                name = d.name;
            else
                name = notFound
            if(d.bensin95)
                bensinPrice = d.bensin95;
            else
                bensinPrice = notFound;
            if(d.bensin95_discount)
                bensinDiscountPrice = d.bensin95_discount;
            else
                bensinDiscountPrice = notFound;
            if(d.diesel)
                dieselPrice = d.diesel;
            else
                dieselPrice = notFound;
            if(d.diesel_discount)
                dieselDiscountPrice = d.diesel_discount;
            else
                dieselDiscountPrice = notFound;


            return "<strong>" + "Company" + ": " + "</strong> <span style='color:red'>" + company + "</span>"+ "<br>" +
                    "<strong>" + "Location" + ": " + "</strong> <span style='color:red'>" + name + "</span>"+ "<br>" +
                    "<strong>" + "Bensin" + ": " + "</strong> <span style='color:red'>" + bensinPrice + " ISK. Discount price: " + bensinDiscountPrice + " ISK" + "</span>"+ "<br>" +
                    "<strong>" + "Diesel" + ": " + "</strong> <span style='color:red'>" + dieselPrice + " ISK. Discount price: " + dieselDiscountPrice + " ISK" + "</span>"+ "<br>";
        });
            
    gasStations.call(tipGas);
    gasStations.selectAll("circle")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "gasstations")
        .attr("cx", function (d) {
            return projection([d.geo.lon, d.geo.lat])[0];
        }).attr("cy", function (d) {
            return projection([d.geo.lon, d.geo.lat])[1];
        }).attr("r", 6)
        .attr("fill", function(d){
            return colorGasstations(d.company);
    }).on('mouseover', tipGas.show).on('mouseout', tipGas.hide);
}

function colorGasstations (company) {
    /**/
    switch(company) {
        case "Atlantsolía":
            return "blue";
        case "Dælan":
            return "brown"
        case "N1":
            return "red";
        case "ÓB":
            return "green"
        case "Olís":
            return "yellow"
        case "Orkan":
            return "deeppink";
        case "Orkan X":
            return "hotpink";
        case "Skeljungur":
            return "gold";
        default:
            return "black";
    }
}

function getGasstationsNames(json) {
    var gasstations = new Set();
    
    json.results.map(function(d){
        gasstations.add(d.company);
    });
    return gasstations;
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
      gasStations.selectAll("circle")
            .attr("cx", function (d) {
                return projection([d.geo.lon, d.geo.lat])[0];
            }).attr("cy", function (d) {
                return projection([d.geo.lon, d.geo.lat])[1];
            }).attr("r", 6);
}

function setTimeStamps(json){
    var priceChange = new Date(json.timestampPriceChanges);
    var priceCheck = new Date(json.timestampPriceCheck);
    $("#priceChange").html(priceChange.toGMTString());
    $("#priceCheck").html(priceCheck.toGMTString());
}

function setHighLowPrice(json) {
    var priceArray = json.results.map(function(d) {
        return  +d.bensin95;
    });
    
    var min = d3.min(priceArray);
    var max = d3.max(priceArray);
    var minStations = json.results.filter(function(d){
        return +d.bensin95 === min; 
    });
        
    var minStationsStr = "";
    
    minStations.map(function(d){
       minStationsStr += d.name;
       minStationsStr += ", ";
    });
    console.log(minStationsStr);
    $("#lowestPriceTxt").html(minStationsStr);
    $("#lowestPrice").html(min);
    $("#highestPrice").html(max);

}