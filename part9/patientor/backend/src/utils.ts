import {
  Gender,
  NewPatient,
  NewEntry,
  Diagnosis,
  HealthCheckRating,
} from "./types";
import { z } from "zod";

export const NewPatientEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(Gender),
  occupation: z.string(),
  ssn: z.string(),
});

export const toNewPatientEntry = (object: unknown): NewPatient => {
  return NewPatientEntrySchema.parse(object);
};

// Helper function to parse diagnosis codes
const parseDiagnosisCodes = (object: unknown): Array<Diagnosis["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnosis["code"]>;
};

// Helper functions for parsing entry fields
const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error("Incorrect or missing description");
  }
  return description;
};

const parseDate = (date: unknown): string => {
  if (!isString(date)) {
    throw new Error("Incorrect or missing date");
  }
  return date;
};

const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error("Incorrect or missing specialist");
  }
  return specialist;
};

const parseEmployerName = (employerName: unknown): string => {
  if (!isString(employerName)) {
    throw new Error("Incorrect or missing employer name");
  }
  return employerName;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (
  healthCheckRating: unknown,
): HealthCheckRating => {
  if (!healthCheckRating || !isHealthCheckRating(Number(healthCheckRating))) {
    throw new Error("Incorrect or missing health check rating");
  }
  return Number(healthCheckRating) as HealthCheckRating;
};

// Main function to parse new entry
export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  const objectWithType = object as { type: string; [key: string]: unknown };

  if (!("type" in objectWithType)) {
    throw new Error("Missing entry type");
  }

  const baseEntry = {
    description: parseDescription(objectWithType.description),
    date: parseDate(objectWithType.date),
    specialist: parseSpecialist(objectWithType.specialist),
    diagnosisCodes: parseDiagnosisCodes(object),
  };

  switch (objectWithType.type) {
    case "Hospital": {
      const dischargeInfo = objectWithType.discharge as
        | { date: unknown; criteria: unknown }
        | undefined;
      if (!dischargeInfo) {
        throw new Error("Missing discharge information for hospital entry");
      }
      return {
        ...baseEntry,
        type: "Hospital",
        discharge: {
          date: parseDate(dischargeInfo.date),
          criteria: parseDescription(dischargeInfo.criteria),
        },
      } as NewEntry;
    }

    case "OccupationalHealthcare": {
      const baseOccupationalEntry = {
        ...baseEntry,
        type: "OccupationalHealthcare" as const,
        employerName: parseEmployerName(objectWithType.employerName),
      };

      const sickLeaveInfo = objectWithType.sickLeave as
        | { startDate: unknown; endDate: unknown }
        | undefined;
      if (sickLeaveInfo) {
        return {
          ...baseOccupationalEntry,
          sickLeave: {
            startDate: parseDate(sickLeaveInfo.startDate),
            endDate: parseDate(sickLeaveInfo.endDate),
          },
        } as NewEntry;
      }

      return baseOccupationalEntry as NewEntry;
    }

    case "HealthCheck": {
      return {
        ...baseEntry,
        type: "HealthCheck",
        healthCheckRating: parseHealthCheckRating(
          objectWithType.healthCheckRating,
        ),
      } as NewEntry;
    }

    default:
      throw new Error("Incorrect entry type");
  }
};
