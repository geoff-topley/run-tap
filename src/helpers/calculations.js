import moment from "moment";

export const metersToMiles = (distance, fractional) => {
  return (distance / 1609.344).toFixed(fractional);
};

export const metersToKm = (distance, fractional) => {
  return (distance / 1000).toFixed(fractional);
}

export const metersToFeet = (distance, fractional) => {
  return (distance * 3.281).toFixed(fractional);
};

export const secondsToMinutes = (time) => {
  return moment.utc(time * 1000).format("HH:mm:ss");
};

export const pace = (time, distance) => {
  var totalMinutes = time / 60,
    pace = totalMinutes / distance,
    paceMinutes = Math.floor(pace),
    paceSeconds = Math.round((pace - paceMinutes) * 60);

  if (paceSeconds < 10) {
    paceSeconds = "0" + paceSeconds;
  }

  return `${paceMinutes}.${paceSeconds}`;
};
