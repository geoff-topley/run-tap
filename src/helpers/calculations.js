import moment from "moment";

export const metersToMiles = (distance) => {
  return (distance / 1609.344).toFixed(2);
};

export const secondsToMinutes = (time) => {
  return moment.utc(time * 1000).format("HH:mm:ss");
};
