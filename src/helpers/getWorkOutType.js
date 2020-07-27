export const getWorkoutType = (workoutType) => {
  switch (workoutType) {
    case 0:
      return "Base Building";
    case 1:
      return "Race";

    case 2:
      return "Long Run";

    case 3:
      return "Workout";

    default:
      return "TBD";
  }
};
