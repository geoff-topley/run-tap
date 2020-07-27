import React from "react";
import axios from "axios/index";
import mapboxgl from "mapbox-gl/dist/mapbox-gl.js";
import polyline from "@mapbox/polyline";
import ActivityModal from "./Modal/Modal";
import { handleError } from "../../errorHandling/ErrorHandling";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

export class FullActivity extends React.Component {
  state = {
    isLoading: true,
    activity: {},
    lat: 0,
    lng: 0,
    polyline: "",
    showModal: false,
    activityName: "",
    id: "",
  };

  componentDidMount() {
    // activity ID passed from Link and used to retrieve all Activity data
    this.setState({ id: this.props.match.params.id });
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
          isLoading: false,
          activity: response.data,
          activityName: response.data.name,
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

  onClickOpenModal = () => {
    this.setState({ showModal: true });
  };

  onClickCancelModal = () => {
    const { name } = this.state.activity;
    this.setState({ showModal: false, activityName: name });
  };

  onChangeActivityName = (event) => {
    let activityName = event.target.value;
    this.setState({
      activityName,
    });
  };

  saveNewActivityName = () => {
    const { id } = this.state;
    let url = `https://www.strava.com/api/v3/activities/${id}`;
    const access_token = localStorage.getItem("access_token");

    axios({
      method: "put",
      url: url,
      data: {
        name: this.state.activityName,
      },
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((response) => {
        this.setState({ showModal: false, activity: response.data });
      })
      .catch(() => {
        handleError(
          "Error updating Activity details. Please check console",
          "toast-top-center",
          "3000",
          "error"
        );
      });
  };

  render() {
    const { name } = this.state.activity;
    let activityName = this.state.activityName;
    let { showModal } = this.state;

    return (
      <div>
        {this.state.isLoading ? (
          <Container style={{ marginTop: "8px" }}>
            <Row>
              <Col md={{ offset: 5 }}>
                <Spinner size="lg" animation="border" />
              </Col>
            </Row>
          </Container>
        ) : (
          <>
            <Row style={{ marginTop: "8px" }}>
              <Col>
                <Card bg="light" className="text-center">
                  <Card.Body>
                    <h6>
                      {name}{" "}
                      <Button
                        style={{ marginLeft: "8px" }}
                        variant="primary"
                        size="sm"
                        onClick={this.onClickOpenModal}
                      >
                        Edit
                      </Button>
                    </h6>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <ActivityModal
              showModal={showModal}
              activityName={activityName}
              onClickCancelModal={this.onClickCancelModal}
              onChangeActivityName={this.onChangeActivityName}
              saveNewActivityName={this.saveNewActivityName}
            />

            <Row style={{ marginTop: "8px" }}>
              <Col md={6}>
                <div
                  style={{ height: "400px", width: "500px" }}
                  ref={(el) => (this.mapContainer = el)}
                />
              </Col>
            </Row>
          </>
        )}
      </div>
    );
  }
}

export default FullActivity;
