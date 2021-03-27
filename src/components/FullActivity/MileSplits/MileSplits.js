import React from "react";
import { HorizontalBar } from "react-chartjs-2";
import * as calculate from "../../../helpers/calculations";

const MileSplits = ({ mileSplits }) => {
  let milePace = null;
  let lapNames = null;

  if (mileSplits !== undefined) {
    milePace = mileSplits.map((mileSplit) => {
      return calculate.pace(
        mileSplit.moving_time,
        calculate.metersToMiles(mileSplit.distance, 4)
      );
    });

    lapNames = mileSplits.map((mileSplit) => {
      return mileSplit.split;
    });
  }

  const data = {
    labels: lapNames,
    datasets: [
      {
        label:
          milePace == null
            ? "No lap data found for this activity"
            : "Average Pace per Mile Split",
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
  );
};

export default MileSplits;
