export const getWorkoutTypeText = (workoutType) => {
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

export const getWorkoutTypeCode = (workoutType) => {
  switch (workoutType) {
    case "Base Building":
      return 0;
    case "Race":
      return 1;
    case "Long Run":
      return 2;
    case "Workout":
      return 3;
    default:
      return null;
  }
};
