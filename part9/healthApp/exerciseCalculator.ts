interface ExerciseInput {
  target: number;
  exerciseHours: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseInput => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  const exerciseHours = args.slice(3).map(Number);

  if (isNaN(target) || exerciseHours.some(isNaN)) {
    throw new Error("Provided values were not numbers!");
  }

  return {
    target,
    exerciseHours,
  };
};

interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

export const calculateExercises = (
  target: number,
  exerciseHours: number[],
): ExerciseResult => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter((h) => h > 0).length;
  const average = exerciseHours.reduce((a, b) => a + b, 0) / periodLength;
  const success = average >= target;
  let rating: number;
  let ratingDescription: string;

  if (average < target * 0.5) {
    rating = 1;
    ratingDescription = "You need to work harder!";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "Not too bad but could be better.";
  } else {
    rating = 3;
    ratingDescription = "Great job! You've met your target.";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  try {
    const { target, exerciseHours } = parseExerciseArguments(process.argv);
    console.log(calculateExercises(target, exerciseHours));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
