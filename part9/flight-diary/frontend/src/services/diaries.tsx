const baseUrl = "/api/diaries";

import axios from "axios";
import type { DiaryEntry, NewDiaryEntry } from "../types";

export const createDiary = async (diary: NewDiaryEntry) => {
  const response = await axios.post<DiaryEntry>(`${baseUrl}`, diary);
  return response.data;
};

export const getAllDiaries = async () => {
  const { data } = await axios.get<DiaryEntry[]>(`${baseUrl}`);
  return data;
};
