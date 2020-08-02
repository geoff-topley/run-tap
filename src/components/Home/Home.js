import React from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import runTaplogo from "../../../src/runTaplogo.png";

class Home extends React.Component {
  render() {
    return (
      <div>
        <Row style={{ marginTop: "16px" }}>
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
  }
}

export default Home;
