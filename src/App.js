import React from "react";
import { Route } from "react-router-dom";
import Navigation from "./components/Navbar/Navbar";
import Callback from "./components/Callback/Callback";
import Auth from "../src/auth/Auth";
import Home from "../src/components/Home/Home";

class App extends React.Component {
  constructor(props) {
    super(props);

    // create new instance of Auth class
    this.auth = new Auth(this.props.history);
  }

  render() {
    return (
      /* fragment (included with babel 7 via cra) */
      <>
        <Navigation auth={this.auth} />
        <div className="body">
          <Route exact path="/" component={Home} />
          <Route
            path="/callback"
            // passes Auth instance as a prop as well as react-router props hence ...props also
            render={(props) => <Callback auth={this.auth} {...props} />}
          />
        </div>
      </>
    );
  }
}

export default App;
