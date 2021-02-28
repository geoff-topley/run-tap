import React from "react";
import Activity from "../ActivityCard/ActivityCard";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as calculate from "../../helpers/calculations";

const ActivitiesGrid = ({ activities, activitiesFound }) => {
  const numOfColumns = 3;
  const activityList =
    activitiesFound.length > 0 ? activitiesFound : activities;

  const activityGrid = activityList
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
              <Col md={4} style={{ padding: "16px" }} key={rowItem.id}>
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

  return activityGrid;
};

export default ActivitiesGrid;
