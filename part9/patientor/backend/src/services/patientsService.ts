import patients from "../../data/patients";
import {
  NewPatient,
  NonSensitivePatient,
  Patient,
  NewEntry,
  Entry,
} from "../types";
import { v1 as uuid } from "uuid";

const getPatients = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const getPatient = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const addPatient = (newPatient: NewPatient) => {
  const id = uuid();
  const newPatientEntry: Patient = {
    id,
    ...newPatient,
    entries: [],
  };
  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (patientId: string, newEntry: NewEntry): Entry => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    throw new Error("Patient not found");
  }

  const entryId = uuid();
  const entryWithId: Entry = {
    id: entryId,
    ...newEntry,
  } as Entry;

  patient.entries.push(entryWithId);
  return entryWithId;
};

export default {
  getPatients,
  addPatient,
  getPatient,
  addEntry,
};
