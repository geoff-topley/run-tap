import React from "react";
import Loader from "../Loader/Loader";
import Activity from "../ActivityCard/ActivityCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { handleError } from "../../errorHandling/ErrorHandling";
import * as calculate from "../../helpers/calculations";

class Activities extends React.Component {
  constructor(props) {
    super(props);
    this.stravaInstance = this.props.auth.setStravaInstance();
  }

  state = {
    isPageLoading: true,
    searchCriteria: "",
    activities: [],
    activitiesFound: [],
  };

  componentDidMount() {
    this.loadActivities();
  }

  loadActivities = () => {
    const url = `/athlete/activities?per_page=200`;

    this.stravaInstance
      .get(url)
      .then((response) => {
        let activities = response.data;
        this.setState({ activities, isPageLoading: false });
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

  changeActivitySearchValue = (event) => {
    let searchCriteria = event.target.value;
    this.setState({ searchCriteria });
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

  clearSearch = () => {
    this.setState({
      searchCriteria: "",
      activitiesFound: [],
    });
  };

  render() {
    const { activities, activitiesFound } = this.state;
    const numOfColumns = 3;

    const activityList =
      activitiesFound.length > 0 ? activitiesFound : activities;

    const raceGrid = activityList
      .map((_activity, index) => {
        return index % numOfColumns === 0
          ? activityList.slice(index, index + numOfColumns)
          : null;
      })
      .filter((activity) => activity)
      .map((row, index) => {
        return (
          <Row key={index}>
            {row.map((rowItem) => {
              return (
                <Col sm={4} style={{ padding: "16px" }} key={rowItem.id}>
                  <Activity
                    name={rowItem.name}
                    workoutType={rowItem.workout_type}
                    startDate={rowItem.start_date}
                    distance={calculate.metersToMiles(rowItem.distance, 2)}
                    time={calculate.secondsToMinutes(rowItem.moving_time)}
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
                placeholder="Search"
                aria-label="Search"
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
        {this.state.isPageLoading ? <Loader /> : <div>{raceGrid}</div>}
      </>
    );
  }
}

export default Activities;
