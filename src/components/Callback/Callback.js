import React, { useEffect } from "react";
const queryString = require("query-string");

const Callback = ({ auth, location, history }) => {
  useEffect(() => {
    const values = queryString.parse(location.search);
    const authCode = values.code;
    const error = values.error;

    if (authCode && authCode !== "") {
      auth.exchangeAuthCode(authCode);
    }

    if (error && error !== "") {
      history.push("/");
    }
  });

  return <h1>Authenticating...</h1>;
};

export default Callback;
