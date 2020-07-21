import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Badge from "react-bootstrap/Badge";
import moment from "moment";
import { Link } from "react-router-dom";

const printLabel = (workoutType) => {
  switch (workoutType) {
    case 0:
      return (
        <Badge pill variant="dark">
          None
        </Badge>
      );
    case 1:
      return (
        <Badge pill variant="danger">
          Race
        </Badge>
      );
    case 2:
      return (
        <Badge pill variant="warning">
          Long Run
        </Badge>
      );
    case 3:
      return (
        <Badge pill variant="info">
          Workout
        </Badge>
      );
    default:
      return (
        <Badge pill variant="primary">
          TBD
        </Badge>
      );
  }
};

const Activity = ({
  id,
  name,
  startDate,
  workoutType,
  distance,
  time,
  routeToFullActivity,
}) => {
  return (
    <Card>
      <Card.Header as="h5">
        <Row>
          <Col md={9}>
            <Link to={"/activities/" + id} onClick={routeToFullActivity}>
              {name}
            </Link>
          </Col>
          <Col>{printLabel(workoutType)}</Col>
        </Row>
      </Card.Header>

      <Card.Body>
        <Card.Title as="h6">
          {distance} Miles | {time}
        </Card.Title>
        <Card.Text>
          <Button variant="success" block>
            Update Strava Activity
          </Button>
        </Card.Text>
      </Card.Body>

      <Card.Footer>
        <small className="text-muted">
          {moment(startDate).format("Do MMMM YYYY")}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default Activity;
