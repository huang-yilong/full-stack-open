import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";
const app = express();
app.use(express.json());

app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    res.status(400).json({ error: "malformatted parameters" });
  }

  const heightNum = Number(height);
  const weightNum = Number(weight);

  if (isNaN(heightNum) || isNaN(weightNum)) {
    res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(heightNum, weightNum);

  res.json({
    weight: weightNum,
    height: heightNum,
    bmi,
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: "parameters missing" });
  }

  if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    res.status(400).json({ error: "malformatted parameters" });
  }

  const targetNum = Number(target);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const dailyExercisesNum = daily_exercises.map((exercise: unknown) => {
    if (isNaN(Number(exercise))) {
      res.status(400).json({ error: "malformatted parameters" });
    }
    return Number(exercise);
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculateExercises(targetNum, dailyExercisesNum);
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
