import React from "react";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import polyline from "@mapbox/polyline";
import Col from "react-bootstrap/Col";

export class Map extends React.Component {
  componentDidMount() {
    this.loadMap();
  }

  loadMap = () => {
    let decodedPolyline = polyline.toGeoJSON(this.props.polyline);
    let polylineCoordinates = decodedPolyline.coordinates;

    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

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
      center: [this.props.lng, this.props.lat],
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

  render() {
    return (
      <Col md={4}>
        <div
          style={{ height: "400px", width: "500px" }}
          id="mapContainer"
        ></div>
      </Col>
    );
  }
}

export default Map;
