import React from "react";
import axios from "axios";
import _ from "lodash";
import ActivityCard from "../../components/ActivityCard/ActivityCard";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import * as convert from "../../helpers/calculations";
import { handleError } from "../../errorHandling/ErrorHandling";

class Activities extends React.Component {
  constructor(props) {
    super(props);

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
    searchCriteria: "",
    activities: [],
    activitiesFound: [],
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
    const access_token = localStorage.getItem("access_token");
    const { activities, perPage, page } = this.state;
    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const url = `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}&page=${page}`;
    axios
      .get(url, config)
      .then((response) => {
        this.setState({
          activities: [...activities, ...response.data],
          scrolling: false,
          isPageLoading: false,
        });
      })
      .catch(() => {
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

  searchActivities = () => {
    const { searchCriteria, activities } = this.state;
    let activitiesFound = activities.filter((activity) => {
      if (
        activity.name.toLowerCase().indexOf(searchCriteria.toLowerCase()) !== -1
      ) {
        return activity;
      } else return null;
    });

    if (activitiesFound.length < 1) {
      handleError(
        "No results found. Please search again.",
        "toast-top-center",
        "2000",
        "warning"
      );
      this.setState((prevState) => ({
        activitiesFound: prevState.activitiesFound,
      }));
    } else {
      this.setState({ activitiesFound });
    }
  };

  changeActivitySearchValue = (event) => {
    let searchCriteria = event.target.value;
    this.setState({ searchCriteria });
  };

  clearSearch = () => {
    this.setState({
      searchCriteria: "",
      activitiesFound: [],
    });
  };

  render() {
    const { activitiesFound, activities } = this.state;
    const numOfColumns = 3;
    const activityList =
      activitiesFound.length > 0 ? activitiesFound : activities;

    const activityGrid = activityList
      .map((activity, index) => {
        return index % numOfColumns === 0
          ? activityList.slice(index, index + numOfColumns)
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
                    distance={convert.metersToMiles(rowItem.distance)}
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
        <Row>
          <Col sm={4} style={{ padding: "16px" }}>
            <InputGroup>
              <FormControl
                placeholder="Search recent.."
                aria-label="Search recent.."
                aria-describedby="basic-addon2"
                onChange={this.changeActivitySearchValue}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    this.searchActivities();
                  }
                }}
                value={this.state.searchCriteria}
              />
              <InputGroup.Append>
                <Button
                  variant="outline-secondary"
                  onClick={this.searchActivities}
                >
                  Search
                </Button>
                <Button variant="outline-secondary" onClick={this.clearSearch}>
                  Clear
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>

        {this.state.isPageLoading ? (
          <Container style={{ marginTop: "16px" }}>
            <Row>
              <Col md={{ offset: 5 }}>
                <Spinner size="lg" animation="border" />
              </Col>
            </Row>
          </Container>
        ) : (
          <div>{activityGrid}</div>
        )}
      </>
    );
  }
}

export default Activities;
