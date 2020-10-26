import axios from "axios";

export default class Auth {
  constructor(history) {
    this.history = history;
  }

  exchangeAuthCode = (authCode) => {
    const stravaInstance = this.setStravaInstance();
    const url = process.env.REACT_APP_BACKEND;
    stravaInstance
      .get(url, {
        params: { code: authCode },
      })
      .then((response) => {
        this.setSession(response);
        this.history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });

    // proxy set up in setupProxy.js so I can test locally on localhost:9000
    /*const url = `/.netlify/functions/getSessionData?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&code=${authCode}`;
    axios
      .post(url)
      .then((response) => {
        this.setSession(response);
        this.history.push("/");
      })
      .catch((error) => {
        console.log(error);
      });*/
  };

  setSession = (authResult) => {
    const expires_at = JSON.stringify(
      authResult.data.expires_in * 1000 + new Date().getTime()
    );
    const profile = JSON.stringify(authResult.data.athlete);

    localStorage.setItem("expires_at", expires_at);
    localStorage.setItem("refresh_token", authResult.data.refresh_token);
    localStorage.setItem("access_token", authResult.data.access_token);
    localStorage.setItem("profile", profile);
  };

  setStravaInstance = () => {
    const stravaInstance = axios.create({
      baseURL: "https://www.strava.com/api/v3",
    });

    const access_token = localStorage.getItem("access_token");
    stravaInstance.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${access_token}`;

    return stravaInstance;
  };

  isAuthenticated = () => {
    const expires_at = JSON.parse(localStorage.getItem("expires_at"));
    return new Date().getTime() < expires_at;
  };

  logout = () => {
    localStorage.removeItem("expires_at");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("profile");
    this.history.push("/");
  };
}
