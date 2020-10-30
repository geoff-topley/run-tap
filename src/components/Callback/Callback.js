import React, { useEffect } from "react";
import Loader from "../Loader/Loader";
import { handleError } from "../../errorHandling/ErrorHandling";
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
      console.log(error);
      handleError(
        "Error authenticating. Please check console.",
        "toast-top-center",
        "3000",
        "error"
      );
      history.push("/");
    }
  });

  return <Loader />;
};

export default Callback;
