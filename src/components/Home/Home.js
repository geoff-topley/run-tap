import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import runTaplogo from "../../../src/runTaplogo.png";

const Home = () => {
  return (
    <div>
      <Row>
        <Col>
          <img
            src={runTaplogo}
            alt="runTaplogo"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
