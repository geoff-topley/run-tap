import React, { useState, useEffect, useMemo } from "react";
import Loader from "../Loader/Loader";
import ActivitiesGrid from "./ActivitiesGrid";
import SearchBar from "./SearchBar";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import { handleError } from "../../errorHandling/ErrorHandling";

const Activities = ({ auth }) => {
  const [pageLoading, setPageLoading] = useState(true);
  const [searchCriteria, setSearchCriteria] = useState("");
  const [activities, setActivities] = useState([]);
  const [activitiesFound, setActivitiesFound] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);

  // returns a memoized value - therefore preventing the infinite useEffect loop when referenced value was previously passed
  const stravaInstance = useMemo(() => auth.setStravaInstance(), [auth]);

  // second argument in useEffect - a list of reasons useEffect should run (dependency array). [] means run once
  useEffect(() => {
    loadActivities(pageNumber);

  // eslint-disable-next-line
  }, [stravaInstance]);

  const loadActivities = (pageNumber) => {
    setPageLoading(true);
    setPageNumber(pageNumber);
    const url = `/athlete/activities?page=${pageNumber}&per_page=48`;

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

  let active = pageNumber;
  let items = [];
  for (let number = 1; number <= 18; number++) {
    items.push(
      <Pagination.Item
        key={number}
        active={number === active}
        onClick={() => loadActivities(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  return (
    <>
      <Row>
        <Col md={4} style={{ padding: "16px" }}>
          <SearchBar
            searchCriteria={searchCriteria}
            changeActivitySearchValue={changeActivitySearchValue}
            searchActivities={searchActivities}
            clearSearch={clearSearch}
          />
        </Col>
      </Row>
      {pageLoading ? (
        <Loader />
      ) : (
        <>
          <ActivitiesGrid
            activities={activities}
            activitiesFound={activitiesFound}
          />
          <Pagination size="md">{items}</Pagination>
        </>
      )}
    </>
  );
};

export default Activities;
