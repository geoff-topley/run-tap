import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import polyline from "@mapbox/polyline";
import Col from "react-bootstrap/Col";

const loadMap = (polylineData, lng, lat) => {
  let decodedPolyline = polyline.toGeoJSON(polylineData);
  let polylineCoordinates = decodedPolyline.coordinates;

  mapboxgl.accessToken = process.env.REACT_APP_MAP_LOCAL;

  if (process.env.REACT_APP_ENV === "production")
    mapboxgl.accessToken = process.env.REACT_APP_MAP;

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          properties: {},
          coordinates: polylineCoordinates,
        },
      },
    ],
  };

  const map = new mapboxgl.Map({
    container: "mapContainer",
    style: "mapbox://styles/mapbox/streets-v11",
    center: [lng, lat],
    zoom: 13,
  });

  map.on("load", function () {
    map.addSource("LineString", {
      type: "geojson",
      data: geojson,
    });
    map.addLayer({
      id: "LineString",
      type: "line",
      source: "LineString",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#DC143C",
        "line-width": 5,
      },
    });

    let coordinates = geojson.features[0].geometry.coordinates;
    let bounds = coordinates.reduce((bounds, coordinate) => {
      return bounds.extend(coordinate);
    }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

    map.fitBounds(bounds, {
      padding: 20,
    });
  });
};

const Map = ({polylineData, lng, lat}) => {

  useEffect(() => {
    loadMap(polylineData, lng, lat);
  });

  return (
    <Col md={4}>
      <div style={{ height: "400px", width: "500px" }} id="mapContainer"></div>
    </Col>
  );
};

export default Map;
