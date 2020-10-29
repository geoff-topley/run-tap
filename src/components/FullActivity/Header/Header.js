import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import { getWorkoutTypeColor } from "../../../helpers/getWorkOutType";

const Header = ({ name, shoeName, workout_type, onClickOpenModal }) => {
  return (
    <Row style={{ marginTop: "16px" }}>
      <Col>
        <Card bg="light" className="text-center">
          <Card.Body>
            <Row>
              <Col md={4} style={{ marginTop: "5px" }}>
                <h5>
                  <Badge
                    pill
                    variant={getWorkoutTypeColor(workout_type)}
                    className="float-left"
                  >
                    {shoeName}
                  </Badge>
                </h5>
              </Col>
              <Col md={4}>
                <h5>
                  {name}{" "}
                  <Button
                    style={{ marginLeft: "8px" }}
                    variant="primary"
                    size="sm"
                    onClick={onClickOpenModal}
                  >
                    Edit
                  </Button>
                </h5>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Header;
