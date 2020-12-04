import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Jumbotron from "react-bootstrap/Jumbotron";
import * as calculate from "../../../helpers/calculations";

const Stats = ({ activity }) => {
  return (
    <Jumbotron style={{ height: "400px", width: "500px" }}>
      <Row>
        <Col sz={4}>
          <strong>{calculate.metersToMiles(activity.distance, 2)} mi</strong>
        </Col>

        <Col sz={4}>
          <strong>{calculate.secondsToMinutes(activity.moving_time)}</strong>
        </Col>

        <Col sz={4}>
          <strong>
            {calculate.pace(
              activity.moving_time,
              calculate.metersToMiles(activity.distance, 4)
            )}{" "}
            / mi
          </strong>
        </Col>
      </Row>

      <Row>
        <Col sz={4}>Distance</Col>
        <Col sz={4}>Time</Col>
        <Col sz={4}>Pace</Col>
      </Row>
    </Jumbotron>
  );
};

export default Stats;
