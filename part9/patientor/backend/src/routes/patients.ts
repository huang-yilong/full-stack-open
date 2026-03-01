import express from "express";
import { Response } from "express";
import patientsService from "../services/patientsService";
import { NonSensitivePatient } from "../types";
import { toNewPatientEntry, toNewEntry } from "../utils";
const router = express.Router();

router.get("/", (_req, res: Response<NonSensitivePatient[]>) => {
  res.json(patientsService.getPatients());
});

router.get("/:id", (req, res) => {
  const patient = patientsService.getPatient(req.params.id);
  if (patient) {
    res.json(patient);
  } else {
    res.status(404).json({ error: "Patient not found" });
  }
});

router.post("/", (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const newPatient = patientsService.addPatient(newPatientEntry);
    res.json(newPatient);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const patientId = req.params.id;
    const newEntry = toNewEntry(req.body);
    const addedEntry = patientsService.addEntry(patientId, newEntry);
    res.json(addedEntry);
  } catch (error) {
    if (error instanceof Error && error.message === "Patient not found") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
});

export default router;
