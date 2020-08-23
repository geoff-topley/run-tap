import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const Header = ({ name, onClickOpenModal }) => {
  return (
    <Row style={{ marginTop: "16px" }}>
      <Col>
        <Card bg="light" className="text-center">
          <Card.Body>
            <h6>
              {name}{" "}
              <Button
                style={{ marginLeft: "8px" }}
                variant="primary"
                size="sm"
                onClick={onClickOpenModal}
              >
                Edit
              </Button>
            </h6>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Header;
