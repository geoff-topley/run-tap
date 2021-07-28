import React from "react";
import _ from "lodash";
import Loader from "../Loader/Loader";
import ActivitiesGrid from "./ActivitiesGrid";
import { handleError } from "../../errorHandling/ErrorHandling";

class RecentActivities extends React.Component {
  constructor(props) {
    super(props);
    this.stravaInstance = this.props.auth.setStravaInstance();

    // Since scroll events can fire at a high rate, the event handler shouldn't execute computationally
    // expensive operations such as DOM modifications. Instead, it is recommended to throttle
    this.callback = _.throttle(() => {
      this.handleScroll();
    }, 500);
  }

  state = {
    isPageLoading: true,
    perPage: 21,
    page: 1,
    scrolling: false,
    activities: [],
  };

  componentDidMount() {
    this.loadActivities();
    window.addEventListener("scroll", this.callback);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.callback);
  }

  routeToFullActivity = () => {
    window.removeEventListener("scroll", this.callback);
  };

  handleScroll = () => {
    const { scrolling } = this.state;
    if (scrolling) return;

    const activityRowArray = document.querySelectorAll("div.activityRow");
    const lastActivityRow = activityRowArray[activityRowArray.length - 1];
    const lastActivityRowOffset =
      lastActivityRow.offsetTop + lastActivityRow.clientHeight;
    const pageOffset = window.pageYOffset + window.innerHeight;
    const bottomOffset = 20;

    if (pageOffset > lastActivityRowOffset - bottomOffset) {
      this.loadMore();
    }
  };

  loadActivities = () => {
    const { activities, perPage, page } = this.state;
    const url = `/athlete/activities?per_page=${perPage}&page=${page}`;

    this.stravaInstance
      .get(url)
      .then((response) => {
        this.setState({
          activities: [...activities, ...response.data],
          scrolling: false,
          isPageLoading: false,
        });
      })
      .catch((error) => {
        console.log(error);
        handleError(
          "Error loading Activities. Please check console.",
          "toast-top-center",
          "3000",
          "error"
        );
        this.setState({ isPageLoading: false });
      });
  };

  loadMore = () => {
    this.setState(
      (prevState) => ({
        page: prevState.page + 1,
        scrolling: true,
      }),
      this.loadActivities
    );
  };

  render() {
    return (
      <>
        {this.state.isPageLoading ? (
          <Loader />
        ) : (
          <ActivitiesGrid
            activities={this.state.activities}
            activitiesFound={0}
            routeToFullActivity={this.routeToFullActivity}
          />
        )}
        {this.state.scrolling && <Loader />}
      </>
    );
  }
}

export default RecentActivities;
