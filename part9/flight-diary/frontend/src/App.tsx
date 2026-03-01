import { useState, useEffect } from "react";

import type { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import { getAllDiaries, createDiary } from "./services/diaries";

const App = () => {
  const [newDiary, setNewDiary] = useState<NewDiaryEntry>({
    date: "",
    weather: "sunny",
    visibility: "great",
    comment: "",
  });
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaryList = async () => {
      const diaries = await getAllDiaries();
      setDiaries(diaries);
    };
    fetchDiaryList();
  }, []);

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    createDiary(newDiary).then((data) => {
      setDiaries(diaries.concat(data));
    });
    setNewDiary({
      date: "",
      weather: "sunny",
      visibility: "great",
      comment: "",
    });
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <form onSubmit={diaryCreation}>
        <div>
          date
          <input
            type="date"
            value={newDiary.date}
            onChange={(event) =>
              setNewDiary({ ...newDiary, date: event.target.value })
            }
          />
        </div>
        <div>
          visibility
          <label>
            great
            <input
              type="radio"
              name="visibility"
              value="great"
              checked={newDiary.visibility === "great"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  visibility: event.target.value as Visibility,
                })
              }
            />
          </label>
          <label>
            good
            <input
              type="radio"
              name="visibility"
              value="good"
              checked={newDiary.visibility === "good"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  visibility: event.target.value as Visibility,
                })
              }
            />
          </label>
          <label>
            ok
            <input
              type="radio"
              name="visibility"
              value="ok"
              checked={newDiary.visibility === "ok"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  visibility: event.target.value as Visibility,
                })
              }
            />
          </label>
          <label>
            poor
            <input
              type="radio"
              name="visibility"
              value="poor"
              checked={newDiary.visibility === "poor"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  visibility: event.target.value as Visibility,
                })
              }
            />
          </label>
        </div>
        <div>
          weather
          <label>
            sunny
            <input
              type="radio"
              name="weather"
              value="sunny"
              checked={newDiary.weather === "sunny"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  weather: event.target.value as Weather,
                })
              }
            />
          </label>
          <label>
            rainy
            <input
              type="radio"
              name="weather"
              value="rainy"
              checked={newDiary.weather === "rainy"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  weather: event.target.value as Weather,
                })
              }
            />
          </label>
          <label>
            cloudy
            <input
              type="radio"
              name="weather"
              value="cloudy"
              checked={newDiary.weather === "cloudy"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  weather: event.target.value as Weather,
                })
              }
            />
          </label>
          <label>
            stormy
            <input
              type="radio"
              name="weather"
              value="stormy"
              checked={newDiary.weather === "stormy"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  weather: event.target.value as Weather,
                })
              }
            />
          </label>
          <label>
            windy
            <input
              type="radio"
              name="weather"
              value="windy"
              checked={newDiary.weather === "windy"}
              onChange={(event) =>
                setNewDiary({
                  ...newDiary,
                  weather: event.target.value as Weather,
                })
              }
            />
          </label>
        </div>
        <div>
          comment
          <input
            value={newDiary.comment}
            onChange={(event) =>
              setNewDiary({ ...newDiary, comment: event.target.value })
            }
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <ul>
        {diaries.map((diary) => (
          <li key={diary.id}>
            {diary.date} {diary.weather} {diary.visibility} {diary.comment}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default App;
