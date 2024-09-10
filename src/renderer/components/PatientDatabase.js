import React, { useState, useContext } from 'react';
import {
  TextField,
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PatientContext } from './PatientContext'; // Import the context

function PatientDatabase() {
  const { patients, setPatients } = useContext(PatientContext); // Use context for patients data
  const [currentPatient, setCurrentPatient] = useState({
    id: null,
    name: '',
    age: '',
    diagnosis: '',
  });
  const [openDialog, setOpenDialog] = useState(false); // Controls the dialog visibility
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // New state to store search input
  const navigate = useNavigate(); // Initialize the navigate hook

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPatient({ ...currentPatient, [name]: value });
  };

  // Add a new patient to the list
  const addPatient = () => {
    setPatients([...patients, { ...currentPatient, id: patients.length + 1 }]);
    clearForm();
  };

  // Edit an existing patient
  const editPatient = (patient) => {
    setCurrentPatient(patient);
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Update an existing patient
  const updatePatient = () => {
    setPatients(
      patients.map((p) => (p.id === currentPatient.id ? currentPatient : p)),
    );
    clearForm();
    setOpenDialog(false);
  };

  // Delete a patient from the list
  const deletePatient = (id) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  // Clear the form after adding/editing a patient
  const clearForm = () => {
    setCurrentPatient({ id: null, name: '', age: '', diagnosis: '' });
    setIsEditing(false);
  };

  // Handle opening the dialog to add a patient
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    clearForm();
  };

  // Handle name click to navigate to a new patient details page
  const handleNameClick = (patient) => {
    navigate(`/patient/${patient.id}`, { state: { patient } });
  };

  // Function to filter patients based on search term
  const filteredPatients = patients.filter((patient) =>
    Object.values(patient).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  return (
    <Container>
      <h1>Patient Database</h1>

      <Button variant="contained" color="primary" onClick={handleOpenDialog}>
        Add Patient
      </Button>

      {/* Search Input */}
      <TextField
        label="Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update search term state
      />

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{isEditing ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            name="name"
            fullWidth
            value={currentPatient.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Age"
            name="age"
            type="number"
            fullWidth
            value={currentPatient.age}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            label="Diagnosis"
            name="diagnosis"
            fullWidth
            value={currentPatient.diagnosis}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={isEditing ? updatePatient : addPatient}
            color="primary"
          >
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Patient List Table */}
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Diagnosis</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell
                  style={{ cursor: 'pointer', color: 'blue' }}
                  onClick={() => handleNameClick(patient)}
                >
                  {patient.name}
                </TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.diagnosis}</TableCell>
                <TableCell>
                  <IconButton onClick={() => editPatient(patient)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deletePatient(patient.id)} color="secondary">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default PatientDatabase;
