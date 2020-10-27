import React from "react";
import Col from "react-bootstrap/Col";
import { HorizontalBar } from "react-chartjs-2";
import { calculateMilePace } from "../../../helpers/calculations";
import { metersToMiles } from "../../../helpers/calculations";

const Laps = ({ mileSplits }) => {
  const milePace = mileSplits.map((mileSplit) => {
    return calculateMilePace(
      mileSplit.elapsed_time,
      metersToMiles(mileSplit.distance, 4)
    );
  });

  const lapNames = mileSplits.map((mileSplit) => {
    return mileSplit.split;
  });

  const data = {
    labels: lapNames,
    datasets: [
      {
        label: "Average Mile Pace per Lap",
        backgroundColor: "rgba(255,99,132,0.2)",
        borderColor: "rgba(255,99,132,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: milePace,
      },
    ],
  };

  return (
    <Col md={4}>
      <div>
        <HorizontalBar
          data={data}
          height={400}
          width={500}
          options={{
            scales: {
              xAxes: [
                {
                  ticks: {
                    max: 10,
                    min: 5,
                  },
                },
              ],
            },
          }}
        />
      </div>
    </Col>
  );
};

export default Laps;
