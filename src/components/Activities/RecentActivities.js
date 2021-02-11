import React from "react";
import _ from "lodash";
import Loader from "../Loader/Loader";
import ActivityCard from "../ActivityCard/ActivityCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as convert from "../../helpers/calculations";
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
    perPage: 12,
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
          activities: [
            ...activities,
            ...response.data.filter((activity) => activity.type === "Run"),
          ],
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
    const { activities } = this.state;
    const numOfColumns = 3;

    const activityGrid = activities

      // _activity denotes activity param is not actually utilized
      .map((_activity, index) => {
        return index % numOfColumns === 0
          ? activities.slice(index, index + numOfColumns)
          : null;
      })
      .filter((activity) => activity)
      .map((row, index) => {
        return (
          <Row className="activityRow" key={index}>
            {row.map((rowItem) => {
              return (
                <Col sm={4} style={{ padding: "16px" }} key={rowItem.id}>
                  <ActivityCard
                    name={rowItem.name}
                    workoutType={rowItem.workout_type}
                    startDate={rowItem.start_date}
                    distance={convert.metersToMiles(rowItem.distance, 2)}
                    time={convert.secondsToMinutes(rowItem.moving_time)}
                    id={rowItem.id}
                    routeToFullActivity={this.routeToFullActivity}
                  />
                </Col>
              );
            })}
          </Row>
        );
      });

    return (
      <>
        {this.state.isPageLoading || this.state.scrolling ? (
          <Loader />
        ) : (
          <div>{activityGrid}</div>
        )}
      </>
    );
  }
}

export default RecentActivities;
