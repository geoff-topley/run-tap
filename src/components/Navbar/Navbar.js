import React, { useState } from "react";
import stravaConnect from "../../../src/stravaConnect.png";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function redirect() {
  window.location.href = `https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}/exchange_token&approval_prompt=force&scope=activity:read,activity:write,profile:read_all`;
}

const Navigation = (props) => {
  const [show, setShow] = useState(false);

  const showDropdown = () => {
    setShow(!show);
  };
  const hideDropdown = () => {
    setShow(false);
  };

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand as={NavLink} to="/" exact>
        Run-Tap
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/" exact>
            Home
          </Nav.Link>

          {props.auth.isAuthenticated() ? (
            <NavDropdown
              title="Activities"
              id="basic-nav-dropdown"
              show={show}
              onMouseEnter={showDropdown}
              onMouseLeave={hideDropdown}
            >
              <NavDropdown.Item as={NavLink} to="/recent-activities" exact>
                Recent
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to="/activities">
                All
              </NavDropdown.Item>
            </NavDropdown>
          ) : null}

          {props.auth.isAuthenticated() ? (
            <Nav.Link as={NavLink} to="/profile" exact>
              Profile
            </Nav.Link>
          ) : null}

          <Nav.Link as={NavLink} to="/about" exact>
            About
          </Nav.Link>
        </Nav>
        <Form inline>
          {props.auth.isAuthenticated() ? (
            <Button variant="light" onClick={props.auth.logout}>
              Logout
            </Button>
          ) : (
            <img
              src={stravaConnect}
              alt="stravaConnect"
              style={{ cursor: "pointer" }}
              onClick={redirect}
            />
          )}
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
