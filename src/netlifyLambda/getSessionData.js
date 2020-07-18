import axios from "axios";

exports.handler = function (event, context, callback) {
  const client_id = event.queryStringParameters.client_id;
  const client_secret = event.queryStringParameters.client_secret;
  const code = event.queryStringParameters.code;
  const grant_type = "authorization_code";

  const url = `https://www.strava.com/api/v3/oauth/token?client_id=${client_id}&client_secret=${client_secret}&code=${code}&grant_type=${grant_type}`;

  // server side call handled via netlify lambda secures the client_secret (and any other sensitive data)
  axios
    .post(url)
    .then((response) => {
      callback(null, { statusCode: 200, body: JSON.stringify(response.data) });
    })
    .catch((error) => callback(error));
};
