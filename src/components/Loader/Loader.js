import React from "react";
import Spinner from "react-bootstrap/Spinner";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const Loader = () => {
  return (
    <Container style={{ marginTop: "16px" }}>
      <Row>
        <Col md={{ offset: 5 }}>
          <Spinner size="lg" animation="border" />
        </Col>
      </Row>
    </Container>
  );
};
export default Loader;
