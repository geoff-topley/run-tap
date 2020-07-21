import React from "react";
import axios from "axios/index";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import polyline from "@mapbox/polyline";
import { handleError } from "../../errorHandling/ErrorHandling";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export class FullActivity extends React.Component {
  state = {
    activity: {},
    lat: 0,
    lng: 0,
    polyline: "",
  };

  componentDidMount() {
    this.retrieveActivityData(this.props.match.params.id);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.lat !== this.state.lat || prevState.lng !== this.state.lng)
      this.loadMap();
  }

  retrieveActivityData = (id) => {
    const access_token = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const url = `https://www.strava.com/api/v3/activities/${id}`;
    axios
      .get(url, config)
      .then((response) => {
        this.setState({
          activity: response.data,
          lat: response.data.start_latitude,
          lng: response.data.start_longitude,
          polyline: response.data.map.polyline,
        });
      })
      .catch(() => {
        handleError(
          "Error loading Activity Data. Please check console.",
          "toast-top-center",
          "3000",
          "error"
        );
      });
  };

  loadMap = () => {
    let decodedPolyline = polyline.toGeoJSON(this.state.polyline);
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
      container: this.mapContainer,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [this.state.lng, this.state.lat],
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
      <Row>
        <Col>
          <div
            style={{ height: "400px", width: "500px" }}
            ref={(el) => (this.mapContainer = el)}
          />
        </Col>
      </Row>
    );
  }
}

export default FullActivity;
