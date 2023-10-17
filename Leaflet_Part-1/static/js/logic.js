// Store our API endpoint as queryUrl.
const EARTHQUAKE_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
const COLOR_DEPTHS = [-10,10,30,50,70,90];


let earthquake = L.layerGroup();

/// Create a map object.
let myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);

// Perform a GET request to the query URL/
d3.json(EARTHQUAKE_URL).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {
  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><p>${new Date(feature.properties.time)}</p><hr><h4>${feature.properties.mag}</h4>`);
  };

  function pointToLayer(feature, latlng) {
    let circleMarkerOptions = {
      fillOpacity:0.75,
      stroke: false,
      fillColor: getColor(feature.geometry.coordinates[2]),
      radius: feature.properties.mag * 4,
    };
    return L.circleMarker(latlng, circleMarkerOptions);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: pointToLayer,
  });

  earthquakes.addTo(myMap);
}

// function to get color based on depth
function getColor(depth) {
  return depth <  COLOR_DEPTHS[0] ? "green" :
  depth < COLOR_DEPTHS[1] ? "green" :
  depth < COLOR_DEPTHS[2] ? "lightgreen" :
  depth < COLOR_DEPTHS[3] ? "yellow" :
  depth < COLOR_DEPTHS[4] ? "orange" :
  depth < COLOR_DEPTHS[5] ? "darkorange" :
                            "red";
};

// Set up the legend.
  let legend = L.control({position: "bottomright"});

  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    
    let labels = [];

    // Adding color based on depth range in legend
    for (let i = 0; i < COLOR_DEPTHS.length; i++) {
      div.innerHTML +=
      '<i style="background-color:' + getColor(COLOR_DEPTHS[i] + 0.1) + '">&emsp;</i> ' +
      COLOR_DEPTHS[i] + (COLOR_DEPTHS[i + 1] ? '&ndash;' + COLOR_DEPTHS[i + 1] + '<br>' : '+');
  }
    return div;
  };

  // Adding the legend to the map
  legend.addTo(myMap);
