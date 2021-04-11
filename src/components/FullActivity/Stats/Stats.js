import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Jumbotron from "react-bootstrap/Jumbotron";
import * as calculate from "../../../helpers/calculations";

const getGearMileage = (shoeId, shoes) => {
  let gear = shoes.filter((shoe) => {
    return shoe.id === shoeId;
  });

  return calculate.metersToMiles(gear[0].distance);
};

const Stats = ({ activity, shoeId, shoes }) => {
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

      <Row style={{ paddingTop: "32px" }}>
        <Col sz={4}>
          <strong>
            {calculate.metersToFeet(activity.total_elevation_gain, 0)} ft
          </strong>
        </Col>
        <Col sz={4}>
          <strong>
            {activity.average_cadence !== undefined
              ? (activity.average_cadence * 2).toFixed(0) + " spm"
              : "N/A"}
          </strong>
        </Col>
        <Col>
          <strong>{activity.calories}</strong>
        </Col>
      </Row>

      <Row>
        <Col sz={4}>Elevation Gain</Col>
        <Col sz={4}>Avg. Cadence</Col>
        <Col sz={4}>Calories</Col>
      </Row>

      <Row style={{ paddingTop: "32px" }}>
        <Col sz={4}>
          <strong>
            {shoeId !== undefined && shoes !== undefined
              ? getGearMileage(shoeId, shoes) + " mi"
              : "N/A"}
          </strong>
        </Col>
        <Col sz={4}></Col>
        <Col sz={4}></Col>
      </Row>

      <Row>
        <Col sz={4}>Gear Mileage</Col>
        <Col sz={4}></Col>
        <Col sz={4}></Col>
      </Row>
    </Jumbotron>
  );
};

export default Stats;
