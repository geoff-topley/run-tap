import React from "react";
import { Bar } from "react-chartjs-2";
import * as calculate from "../../../helpers/calculations";

const Laps = ({ laps }) => {
  let lapPace = null;
  let lapNames = null;

  if (laps !== undefined) {
    lapPace = laps.map((lap) => {
      return calculate.pace(
        lap.moving_time,
        calculate.metersToKm(lap.distance, 4)
      );
    });

    lapNames = laps.map((lap) => {
      return lap.name;
    });
  }

  const data = {
    labels: lapNames,
    datasets: [
      {
        label:
          lapPace == null
            ? "No lap data found for this activity"
            : "Average KM Pace per Lap",
        backgroundColor: "rgb(101, 170, 239)",
        borderColor: "rgb(18, 114, 211)",
        borderWidth: 1,
        hoverBackgroundColor: "rgb(55, 145, 235)",
        hoverBorderColor: "rgb(18, 114, 211)",
        data: lapPace,
      },
    ],
  };

  return (
    <div>
      <Bar
        data={data}
        height={400}
        width={500}
        options={{
          scales: {
            yAxes: [
              {
                ticks: {
                  max: 7,
                  min: 2,
                },
              },
            ],
          },
        }}
      />
    </div>
  );
};

export default Laps;
