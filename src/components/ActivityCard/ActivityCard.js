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
        <Badge pill variant="dark" className="float-right">
          Base Building
        </Badge>
      );
    case 1:
      return (
        <Badge pill variant="danger" className="float-right">
          Race
        </Badge>
      );
    case 2:
      return (
        <Badge pill variant="warning" className="float-right">
          Long Run
        </Badge>
      );
    case 3:
      return (
        <Badge pill variant="info" className="float-right">
          Workout
        </Badge>
      );
    default:
      return (
        <Badge pill variant="primary" className="float-right">
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
          <Col md={8}>{name}</Col>
          <Col>{printLabel(workoutType)}</Col>
        </Row>
      </Card.Header>

      <Card.Body>
        <Card.Title as="h6">
          {distance} Miles | {time}
        </Card.Title>
        <Card.Text>
          <Button
            as={Link}
            to={"/activities/" + id}
            onClick={routeToFullActivity}
            variant="success"
            block
          >
            Activity Analysis
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
