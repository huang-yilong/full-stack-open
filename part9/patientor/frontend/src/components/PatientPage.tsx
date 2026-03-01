import { Patient, Gender, Entry, Diagnosis } from "../types";
import {
  LocalHospital as HospitalIcon,
  Work as WorkIcon,
  Favorite as HeartIcon,
  MedicalServices as MedicalIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  TextField,
  Alert,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
  ListItemText,
  Checkbox,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";

interface Props {
  patient: Patient | null | undefined;
  diagnoses: Diagnosis[];
  onEntryAdded: () => void;
}

interface EntryFormData {
  type: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes: string[];
  // HealthCheck specific
  healthCheckRating: string;
  // Hospital specific
  dischargeDate: string;
  dischargeCriteria: string;
  // OccupationalHealthcare specific
  employerName: string;
  sickLeaveStartDate: string;
  sickLeaveEndDate: string;
}

const AddEntryForm = ({
  patientId,
  onEntryAdded,
  onCancel,
  diagnoses,
}: {
  patientId: string;
  onEntryAdded: () => void;
  onCancel: () => void;
  diagnoses: Diagnosis[];
}) => {
  const [formData, setFormData] = useState<EntryFormData>({
    type: "HealthCheck",
    description: "",
    date: "",
    specialist: "",
    diagnosisCodes: [],
    healthCheckRating: "",
    dischargeDate: "",
    dischargeCriteria: "",
    employerName: "",
    sickLeaveStartDate: "",
    sickLeaveEndDate: "",
  });
  const [error, setError] = useState<string>("");

  const healthRatingOptions = [
    { value: "0", label: "0 - Healthy" },
    { value: "1", label: "1 - Low Risk" },
    { value: "2", label: "2 - High Risk" },
    { value: "3", label: "3 - Critical Risk" },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    try {
      const baseEntryData = {
        description: formData.description,
        date: formData.date,
        specialist: formData.specialist,
        type: formData.type,
        diagnosisCodes:
          formData.diagnosisCodes.length > 0
            ? formData.diagnosisCodes
            : undefined,
      };

      let entryData;

      // Add type-specific fields
      switch (formData.type) {
        case "HealthCheck":
          entryData = {
            ...baseEntryData,
            type: "HealthCheck" as const,
            healthCheckRating: parseInt(formData.healthCheckRating),
          };
          break;
        case "Hospital":
          entryData = {
            ...baseEntryData,
            type: "Hospital" as const,
            discharge: {
              date: formData.dischargeDate,
              criteria: formData.dischargeCriteria,
            },
          };
          break;
        case "OccupationalHealthcare":
          entryData = {
            ...baseEntryData,
            type: "OccupationalHealthcare" as const,
            employerName: formData.employerName,
            ...(formData.sickLeaveStartDate &&
              formData.sickLeaveEndDate && {
                sickLeave: {
                  startDate: formData.sickLeaveStartDate,
                  endDate: formData.sickLeaveEndDate,
                },
              }),
          };
          break;
        default:
          throw new Error("Invalid entry type");
      }

      await axios.post<Entry>(
        `${apiBaseUrl}/patients/${patientId}/entries`,
        entryData,
      );

      onEntryAdded();
    } catch (e) {
      if (axios.isAxiosError(e)) {
        const message = e.response?.data?.error || "An error occurred";
        setError(message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Box sx={{ border: "1px dashed #ccc", p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        New {formData.type} entry
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Entry Type Selector */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Entry Type</InputLabel>
          <Select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            label="Entry Type"
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">
              Occupational Healthcare
            </MenuItem>
          </Select>
        </FormControl>

        {/* Common Fields */}
        <TextField
          fullWidth
          label="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        <TextField
          fullWidth
          label="Specialist"
          value={formData.specialist}
          onChange={(e) =>
            setFormData({ ...formData, specialist: e.target.value })
          }
          margin="normal"
          required
        />

        {/* Type-specific Fields */}
        {formData.type === "HealthCheck" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Healthcheck rating</InputLabel>
            <Select
              value={formData.healthCheckRating}
              onChange={(e) =>
                setFormData({ ...formData, healthCheckRating: e.target.value })
              }
              label="Healthcheck rating"
              required
            >
              {healthRatingOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {formData.type === "Hospital" && (
          <>
            <TextField
              fullWidth
              label="Discharge date"
              type="date"
              value={formData.dischargeDate}
              onChange={(e) =>
                setFormData({ ...formData, dischargeDate: e.target.value })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Discharge criteria"
              value={formData.dischargeCriteria}
              onChange={(e) =>
                setFormData({ ...formData, dischargeCriteria: e.target.value })
              }
              margin="normal"
              required
            />
          </>
        )}

        {formData.type === "OccupationalHealthcare" && (
          <>
            <TextField
              fullWidth
              label="Employer name"
              value={formData.employerName}
              onChange={(e) =>
                setFormData({ ...formData, employerName: e.target.value })
              }
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Sick leave start date"
              type="date"
              value={formData.sickLeaveStartDate}
              onChange={(e) =>
                setFormData({ ...formData, sickLeaveStartDate: e.target.value })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              fullWidth
              label="Sick leave end date"
              type="date"
              value={formData.sickLeaveEndDate}
              onChange={(e) =>
                setFormData({ ...formData, sickLeaveEndDate: e.target.value })
              }
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            multiple
            value={formData.diagnosisCodes}
            onChange={(e) => {
              const value =
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value;
              setFormData({ ...formData, diagnosisCodes: value });
            }}
            input={<OutlinedInput label="Diagnosis codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {diagnoses.map((diagnosis) => (
              <MenuItem key={diagnosis.code} value={diagnosis.code}>
                <Checkbox
                  checked={formData.diagnosisCodes.indexOf(diagnosis.code) > -1}
                />
                <ListItemText
                  primary={`${diagnosis.code} - ${diagnosis.name}`}
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onCancel} variant="contained" color="error">
            CANCEL
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "gray",
              "&:hover": { backgroundColor: "darkgray" },
            }}
          >
            ADD
          </Button>
        </Box>
      </form>
    </Box>
  );
};

const EntryDetails = ({
  entry,
  diagnoses,
}: {
  entry: Entry;
  diagnoses: Diagnosis[];
}) => {
  const getDiagnosisName = (code: string): string => {
    const diagnosis = diagnoses.find((d) => d.code === code);
    return diagnosis ? diagnosis.name : code;
  };

  const assertNever = (value: never): never => {
    throw new Error(
      `Unhandled discriminated union member: ${JSON.stringify(value)}`,
    );
  };

  const renderEntryIcon = () => {
    switch (entry.type) {
      case "HealthCheck":
        return <MedicalIcon />;

      case "Hospital":
        return <HospitalIcon />;

      case "OccupationalHealthcare":
        return <WorkIcon />;

      default:
        return assertNever(entry);
    }
  };

  const renderEmployerName = () => {
    if (entry.type === "OccupationalHealthcare") {
      return entry.employerName;
    }
    return null;
  };

  const renderHealthRating = () => {
    if (entry.type === "HealthCheck") {
      const healthRating = entry.healthCheckRating;
      const heartColor =
        healthRating === 0
          ? "green"
          : healthRating === 1
            ? "yellow"
            : healthRating === 2
              ? "orange"
              : "red";
      return <HeartIcon style={{ color: heartColor }} />;
    }
    return null;
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        padding: 2,
        margin: "10px 0",
        borderRadius: 1,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <strong>{entry.date}</strong>
        {renderEntryIcon()}
        {renderEmployerName() && <span>{renderEmployerName()}</span>}
      </Box>

      <div>
        <em>{entry.description}</em>
      </div>

      {renderHealthRating() && <Box sx={{ my: 1 }}>{renderHealthRating()}</Box>}

      <div>diagnosed by {entry.specialist}</div>

      {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
        <ul>
          {entry.diagnosisCodes.map((code, index) => (
            <li key={index}>
              {code} {getDiagnosisName(code)}
            </li>
          ))}
        </ul>
      )}
    </Box>
  );
};

const PatientPage = ({ patient, diagnoses, onEntryAdded }: Props) => {
  const [showAddForm, setShowAddForm] = useState(false);

  if (!patient) {
    return <div>Patient not found</div>;
  }

  const handleEntryAdded = () => {
    onEntryAdded();
    setShowAddForm(false);
  };

  return (
    <div>
      <h3>
        {patient.name} {patient.gender === Gender.Male ? " ♂" : " ♀"}
      </h3>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      {showAddForm ? (
        <AddEntryForm
          patientId={patient.id}
          onEntryAdded={handleEntryAdded}
          onCancel={() => setShowAddForm(false)}
          diagnoses={diagnoses}
        />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowAddForm(true)}
          sx={{ my: 2 }}
        >
          ADD NEW ENTRY
        </Button>
      )}

      <h4>entries</h4>
      {patient.entries && patient.entries.length > 0 ? (
        patient.entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses} />
        ))
      ) : (
        <div>No entries found</div>
      )}
    </div>
  );
};

export default PatientPage;
