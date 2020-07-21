import React from "react";
import { Route, Redirect } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Navigation from "./components/Navbar/Navbar";
import Callback from "./components/Callback/Callback";
import Auth from "../src/auth/Auth";
import Home from "../src/components/Home/Home";
import Activities from "../src/components/Activities/Activities";
import FullActivity from "../src/components/FullActivity/FullActivity";
import Races from "../src/components/Races/Races";
import Profile from "../src/components/Profile/Profile";
import About from "../src/components/About/About";

class App extends React.Component {
  constructor(props) {
    super(props);

    // create new instance of Auth class
    this.auth = new Auth(this.props.history);
  }

  isAuthorized = () => {
    const token = localStorage.getItem("access_token");
    if (token) return true;
  };

  render() {
    return (
      /* fragment (included with babel 7 via cra) */
      <>
        <Navigation auth={this.auth} />
        <Container fluid>
          <Route exact path="/" component={Home} />
          <Route
            path="/callback"
            // passes Auth instance as a prop as well as react-router props hence ...props also
            render={(props) => <Callback auth={this.auth} {...props} />}
          />
          <Route
            exact
            path="/activities"
            onEnter={this.isAuthorized}
            render={(props) =>
              this.isAuthorized() ? (
                <Activities auth={this.auth} {...props} />
              ) : (
                <Redirect to="/" />
              )
            }
          />
          <Route
            path="/activities/:id"
            onEnter={this.isAuthorized}
            component={FullActivity}
          />
          <Route
            exact
            path="/races"
            onEnter={this.isAuthorized}
            component={Races}
          />

          <Route
            path="/profile"
            onEnter={this.isAuthorized}
            render={() => <Profile auth={this.auth} />}
          />
          <Route path="/about" component={About} />
        </Container>
      </>
    );
  }
}

export default App;
