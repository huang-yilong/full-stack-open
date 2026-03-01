import { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useParams,
} from "react-router-dom";
import { Button, Divider, Container, Typography } from "@mui/material";

import { apiBaseUrl } from "./constants";
import { Patient, Diagnosis } from "./types";

import patientService from "./services/patients";
import diagnosesService from "./services/diagnoses";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const PatientPageWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const [patientData, diagnosesData] = await Promise.all([
            patientService.getById(id),
            diagnosesService.getAll(),
          ]);
          setPatient(patientData);
          setDiagnoses(diagnosesData);
        } catch (error) {
          console.error("Error fetching data:", error);
          setPatient(null);
        } finally {
          setLoading(false);
        }
      }
    };

    void fetchData();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleEntryAdded = async () => {
    if (id) {
      try {
        const updatedPatientData = await patientService.getById(id);
        setPatient(updatedPatientData);
      } catch (error) {
        console.error("Error fetching updated patient data:", error);
      }
    }
  };

  return (
    <PatientPage
      patient={patient}
      diagnoses={diagnoses}
      onEntryAdded={handleEntryAdded}
    />
  );
};

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/patients/:id" element={<PatientPageWrapper />} />
            <Route
              path="/"
              element={
                <PatientListPage
                  patients={patients}
                  setPatients={setPatients}
                />
              }
            />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
