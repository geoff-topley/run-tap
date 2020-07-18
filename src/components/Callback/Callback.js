import React from "react";
const queryString = require("query-string");

class Callback extends React.Component {
  componentDidMount() {
    this.getAuthCode();
  }

  getAuthCode() {
    const values = queryString.parse(this.props.location.search);
    const authCode = values.code;
    const error = values.error;

    if (authCode && authCode !== "") {
      this.props.auth.exchangeAuthCode(authCode);
    }

    if (error && error !== "") {
      this.props.history.push("/");
    }
  }

  render() {
    return <h1>Authenticating...</h1>;
  }
}

export default Callback;
