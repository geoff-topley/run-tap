import React from "react";
import axios from "axios";
import Activity from "../ActivityCard/ActivityCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { handleError } from "../../errorHandling/ErrorHandling";
import * as convert from "../../calculations/calculations";

class Races extends React.Component {
  state = {
    isPageLoading: true,
    races: [],
  };

  componentDidMount() {
    this.loadRaces();
  }

  loadRaces = () => {
    const access_token = localStorage.getItem("access_token");
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const url = `https://www.strava.com/api/v3/athlete/activities?per_page=200`;
    axios
      .get(url, config)
      .then((response) => {
        let races = response.data.filter(
          (activity) => activity.workout_type === 1
        );
        this.setState({ races, isPageLoading: false });
      })
      .catch(() => {
        handleError(
          "Error loading Activities. Please check console.",
          "toast-top-center",
          "3000",
          "error"
        );
        this.setState({ isPageLoading: false });
      });
  };

  render() {
    const { races } = this.state;
    const numOfColumns = 3;

    const raceGrid = races
      .map((race, index) => {
        return index % numOfColumns === 0
          ? races.slice(index, index + numOfColumns)
          : null;
      })
      .filter((race) => race)
      .map((row, index) => {
        return (
          <Row className="raceRow" key={index}>
            {row.map((rowItem) => {
              return (
                <Col sm={4} style={{ padding: "16px" }} key={rowItem.id}>
                  <Activity
                    name={rowItem.name}
                    workoutType={rowItem.workout_type}
                    startDate={rowItem.start_date}
                    distance={convert.metersToMiles(rowItem.distance)}
                    time={convert.secondsToMinutes(rowItem.moving_time)}
                    id={rowItem.id}
                    routeToFullActivity={this.routeToFullActivity}
                  />
                </Col>
              );
            })}
          </Row>
        );
      });

    return (
      <div>
        {this.state.isPageLoading ? (
          <Container>
            <Row>
              <Col md={{ offset: 5 }}>
                <Spinner size="lg" animation="border" />
              </Col>
            </Row>
          </Container>
        ) : (
          <div>{raceGrid}</div>
        )}
      </div>
    );
  }
}

export default Races;