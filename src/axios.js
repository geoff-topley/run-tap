import axios from "axios";

const stravaInstance = axios.create({
  baseURL: "https://www.strava.com/api/v3",
});

const access_token = localStorage.getItem("access_token");
stravaInstance.defaults.headers.common[
  "Authorization"
] = `Bearer ${access_token}`;

export default stravaInstance;
