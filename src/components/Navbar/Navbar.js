import React from "react";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

function redirect() {
  window.location.href = `https://www.strava.com/oauth/authorize?client_id=${process.env.REACT_APP_CLIENT_ID}&response_type=code&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}/exchange_token&approval_prompt=force&scope=activity:read`;
}

const Navigation = (props) => (
  <Navbar bg="light" expand="lg">
    <Navbar.Brand as={NavLink} to="/" exact>
      Strava-Tap
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="basic-navbar-nav" />
    <Navbar.Collapse id="basic-navbar-nav">
      <Nav className="mr-auto">
        <Nav.Link as={NavLink} to="/" exact>
          Home
        </Nav.Link>
        <NavDropdown title="Activities" id="basic-nav-dropdown">
          <NavDropdown.Item href="#action/3.1">Recent</NavDropdown.Item>
          <NavDropdown.Item href="#action/3.2">Races</NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="#action/3.4">Search All</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Form inline>
        {props.auth.isAuthenticated() ? (
          <Button variant="primary" onClick={props.auth.logout}>
            Logout
          </Button>
        ) : (
          <Button variant="primary" onClick={redirect}>
            Connect to Strava
          </Button>
        )}
      </Form>
    </Navbar.Collapse>
  </Navbar>
);

export default Navigation;
