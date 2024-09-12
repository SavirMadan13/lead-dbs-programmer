/* eslint-disable react/prop-types */
import React, { useState, useContext, useEffect } from 'react';
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
  Typography,
  TableSortLabel,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PatientContext } from './PatientContext';

function PatientDatabase({ key, directoryPath }) {
  const { patients, setPatients } = useContext(PatientContext);
  const [currentPatient, setCurrentPatient] = useState({
    id: '',
    name: '',
    age: '',
    gender: '',
    diagnosis: '',
  });
  const [originalId, setOriginalId] = useState(null); // Track the original ID
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const navigate = useNavigate();

  // Load selected folder path from Electron's IPC
  // useEffect(() => {
  //   window.electron.ipcRenderer.on('folder-selected', (selectedPath) => {
  //     setDirectoryPath(selectedPath);
  //   });

  //   // Cleanup listener
  //   return () => {
  //     window.electron.ipcRenderer.removeAllListeners('folder-selected');
  //   };
  // }, []);

  useEffect(() => {
    // window.electron.ipcRenderer.on('folder-selected', (selectedPath) => {
    //   setDirectoryPath(selectedPath);
    // });

    window.electron.ipcRenderer.on('file-read-success', (patientsData) => {
      setPatients(patientsData); // Set the patients from the JSON file
    });

    window.electron.ipcRenderer.on('file-not-found', () => {
      console.log('No dataset_description.json found in the selected directory');
    });

    window.electron.ipcRenderer.on('file-read-error', (error) => {
      console.error(error);
    });

    // Cleanup listeners
    // return () => {
    //   window.electron.ipcRenderer.removeListener('folder-selected');
    //   window.electron.ipcRenderer.removeListener('file-read-success');
    //   window.electron.ipcRenderer.removeListener('file-not-found');
    //   window.electron.ipcRenderer.removeListener('file-read-error');
    // };
  }, [setPatients]);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPatient({ ...currentPatient, [name]: value });
  };

  // Add a new patient and save JSON file
  const addPatient = () => {
    const updatedPatients = [...patients, { ...currentPatient }];
    setPatients(updatedPatients);
    savePatientsToJson(updatedPatients); // Save to JSON
    clearForm();
  };

  // Edit a patient
  const editPatient = (patient) => {
    setCurrentPatient(patient);
    setOriginalId(patient.id); // Store the original ID when editing
    setIsEditing(true);
    setOpenDialog(true);
  };

  // Update a patient and save JSON file
  const updatePatient = () => {
    const updatedPatients = patients.map((p) =>
      p.id === originalId ? currentPatient : p,
    );
    setPatients(updatedPatients);
    savePatientsToJson(updatedPatients); // Save to JSON
    clearForm();
    setOpenDialog(false);
  };

  // Delete a patient and save the JSON file
  const deletePatient = (id) => {
    const updatedPatients = patients.filter((p) => p.id !== id);
    setPatients(updatedPatients);
    savePatientsToJson(updatedPatients); // Save to JSON
  };

  // Clear the form
  const clearForm = () => {
    setCurrentPatient({ id: '', name: '', age: '', gender: '', diagnosis: '' });
    setOriginalId(null); // Reset originalId
    setIsEditing(false);
  };

  // Handle sorting when a column header is clicked
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Sort patients based on the column and order
  const sortPatients = (patients, comparator) => {
    const stabilizedPatients = patients.map((el, index) => [el, index]);
    stabilizedPatients.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedPatients.map((el) => el[0]);
  };

  // Sorting comparator function
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  // Descending comparator
  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  // Save the patients data to a JSON file in the selected directory
  const savePatientsToJson = (patientsData) => {
    if (directoryPath) {
      console.log(patientsData);
      window.electron.ipcRenderer.sendMessage(
        'save-patients-json',
        directoryPath,
        patientsData,
      );
    } else {
      console.error('No folder selected');
    }
  };

  // Filter patients based on the search term
  const filteredPatients = sortPatients(
    patients.filter((patient) =>
      Object.values(patient).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    ),
    getComparator(order, orderBy)
  );

  return (
    <div style={{ width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h3"
        style={{
          fontWeight: 'bold',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        DBS Database
      </Typography>

      {/* Search Bar */}
      <div className="search-container" style={{ textAlign: 'right' }}>
        <TextField
          label="Search"
          variant="outlined"
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputLabelProps={{ style: { fontSize: '14px' } }} // Label font size
          InputProps={{ style: { fontSize: '14px' } }} // Input font size
        />
      </div>

      <Container style={{ display: 'flex', flexDirection: 'column' }}>
        {/* Add Patient Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
          style={{
            fontSize: '14px',
            padding: '10px 20px',
            marginBottom: '20px',
            width: '150px',
          }}
        >
          Add Patient
        </Button>

        {/* Patient Table */}
        <TableContainer component={Paper} style={{ flex: 1, marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'age'}
                    direction={orderBy === 'age' ? order : 'asc'}
                    onClick={() => handleRequestSort('age')}
                  >
                    Age
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'gender'}
                    direction={orderBy === 'gender' ? order : 'asc'}
                    onClick={() => handleRequestSort('gender')}
                  >
                    Gender
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'diagnosis'}
                    direction={orderBy === 'diagnosis' ? order : 'asc'}
                    onClick={() => handleRequestSort('diagnosis')}
                  >
                    Diagnosis
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.id}</TableCell>
                  <TableCell
                    style={{ cursor: 'pointer', color: 'blue' }}
                    onClick={() => navigate(`/patient/${patient.id}`, { state: { patient } })}
                  >
                    {patient.name}
                  </TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell>{patient.diagnosis}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => editPatient(patient)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => deletePatient(patient.id)}
                      color="secondary"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog for Adding/Editing a Patient */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {isEditing ? 'Edit Patient' : 'Add Patient'}
          </DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="ID"
              name="id"
              fullWidth
              value={currentPatient.id}
              onChange={handleInputChange}
              InputLabelProps={{ style: { fontSize: '14px' } }}
              InputProps={{ style: { fontSize: '14px' } }}
            />
            <TextField
              margin="dense"
              label="Name"
              name="name"
              fullWidth
              value={currentPatient.name}
              onChange={handleInputChange}
              InputLabelProps={{ style: { fontSize: '14px' } }}
              InputProps={{ style: { fontSize: '14px' } }}
            />
            <TextField
              margin="dense"
              label="Age"
              name="age"
              type="number"
              fullWidth
              value={currentPatient.age}
              onChange={handleInputChange}
              InputLabelProps={{ style: { fontSize: '14px' } }}
              InputProps={{ style: { fontSize: '14px' } }}
            />
            <TextField
              margin="dense"
              label="Gender"
              name="gender"
              fullWidth
              value={currentPatient.gender}
              onChange={handleInputChange}
              InputLabelProps={{ style: { fontSize: '14px' } }}
              InputProps={{ style: { fontSize: '14px' } }}
            />
            <TextField
              margin="dense"
              label="Diagnosis"
              name="diagnosis"
              fullWidth
              value={currentPatient.diagnosis}
              onChange={handleInputChange}
              InputLabelProps={{ style: { fontSize: '14px' } }}
              InputProps={{ style: { fontSize: '14px' } }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDialog(false)}
              color="secondary"
              style={{ fontSize: '14px' }}
            >
              Cancel
            </Button>
            <Button
              onClick={isEditing ? updatePatient : addPatient}
              color="primary"
              style={{ fontSize: '14px' }}
            >
              {isEditing ? 'Update' : 'Add'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default PatientDatabase;
