import React, { useState, useEffect, useMemo } from "react";
import Loader from "../Loader/Loader";
import Activity from "../ActivityCard/ActivityCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import { handleError } from "../../errorHandling/ErrorHandling";
import * as calculate from "../../helpers/calculations";

const Activities = ({ auth }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [activities, setActivities] = useState([]);
  const [activitiesFound, setActivitiesFound] = useState([]);

  // returns a memoized value - therefore preventing the infinite useEffect loop when referenced value was previously passed
  const stravaInstance = useMemo(() => auth.setStravaInstance(), [auth]);

  // second argument in useEffect - a list of reasons useEffect should run (dependency array). [] means run once
  useEffect(() => {
    const loadActivities = () => {
      const url = `/athlete/activities?per_page=48`;

      stravaInstance
        .get(url)
        .then((response) => {
          let activities = response.data;
          setActivities(activities);
          setPageLoading(false);
        })
        .catch((error) => {
          console.log(error);
          handleError(
            "Error loading Activities. Please check console.",
            "toast-top-center",
            "3000",
            "error"
          );
          setPageLoading(false);
        });
    };
    loadActivities();
  }, [stravaInstance]);

  const changeActivitySearchValue = (event) => {
    let searchCriteria = event.target.value;
    setSearchCriteria(searchCriteria);
  };

  const searchActivities = () => {
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
    } else {
      setActivitiesFound(activitiesFound);
    }
  };

  const clearSearch = () => {
    setSearchCriteria("");
    setActivitiesFound([]);
  };

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
              onChange={changeActivitySearchValue}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  searchActivities();
                }
              }}
              value={searchCriteria}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary" onClick={searchActivities}>
                Search
              </Button>
              <Button variant="outline-secondary" onClick={clearSearch}>
                Clear
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      {pageLoading ? <Loader /> : <div>{raceGrid}</div>}
    </>
  );
};

export default Activities;
