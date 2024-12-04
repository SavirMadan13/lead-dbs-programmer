import React, { useState, useContext, useEffect, useRef } from 'react';
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
  Typography,
  TableSortLabel,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { PatientContext } from './PatientContext';
import DatabaseStats from './DatabaseStats';

function PatientDatabase({ key, directoryPath }) {
  const { patients, setPatients } = useContext(PatientContext);
  const [editRowId, setEditRowId] = useState(null); // Track the row being edited
  const [editedPatient, setEditedPatient] = useState({}); // Hold the patient data while editing
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('id');
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [columns, setColumns] = useState([
    // { id: 'id', label: 'ID' },
    { id: 'name', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'gender', label: 'Gender' },
    { id: 'diagnosis', label: 'Diagnosis' },
  ]);
  const [newColumnId, setNewColumnId] = useState('');
  const [newColumnLabel, setNewColumnLabel] = useState('');
  const [columnToDelete, setColumnToDelete] = useState('');

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click(); // Trigger file input click
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        console.log(jsonData); // Pass data to your handler function
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Handle input changes for the edited patient
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle editing a patient
  const handleEditClick = (patient) => {
    setEditRowId(patient.id);
    setEditedPatient({ ...patient });
  };

  // Save updated patient
  const handleSaveClick = () => {
    const updatedPatients = patients.map((p) =>
      p.id === editRowId ? editedPatient : p,
    );
    setPatients(updatedPatients);
    savePatientsToJson(updatedPatients); // Save to JSON
    setEditRowId(null); // Exit edit mode
  };

  // Cancel editing
  const handleCancelClick = () => {
    setEditRowId(null);
    setEditedPatient({});
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
      Object.values(patient).some(
        (value) =>
          value &&
          value
            .toString()
            .toLowerCase()
            .includes(searchTerm.toString().toLowerCase()),
      ),
    ),
    getComparator(order, orderBy),
  );

  const [currentPatient, setCurrentPatient] = useState({
    id: '',
    name: '',
    age: '',
    gender: '',
    diagnosis: '',
  });
  const [originalId, setOriginalId] = useState(null); // Track the original ID
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    window.electron.ipcRenderer.on('file-read-success', (patientsData) => {
      setPatients(patientsData); // Set the patients from the JSON file
    });

    window.electron.ipcRenderer.on('file-not-found', () => {
      console.log(
        'No dataset_description.json found in the selected directory',
      );
    });

    window.electron.ipcRenderer.on('file-read-error', (error) => {
      console.error(error);
    });
  }, [setPatients]);

  useEffect(() => {
    // console.log(window.electron.ipcRenderer);
    if (window.electron && window.electron.ipcRenderer && patients.length > 0) {
      window.electron.ipcRenderer.once('import-inputdata-file', (arg) => {
        try {
          console.log('Received: ', arg);
          if (arg.mode === 'stimulate') {
            console.log('LeadDBS Patients: ', patients);

            // navigate('/programmer');
            console.log('stimulate');
            if (arg.type === 'leaddbs') {
              let outputPatient = {};
              let outputTimeline = '';
              console.log(arg.patientname[0]);
              Object.keys(patients).forEach((patient) => {
                if (patients[patient].id === arg.patientname) {
                  outputPatient = patients[patient];
                  outputTimeline = arg.labels ? arg.labels[0] : arg.label;
                  let leadDBS = true;
                  navigate('/programmer', {
                    state: {
                      patient: outputPatient,
                      timeline: outputTimeline,
                      directoryPath,
                      leadDBS,
                    },
                  });
                }
              });
            } else if (arg.type === 'leadgroup') {
              const leadDBS = true;
              console.log('patients: ', patients);
              const firstKey = Object.keys(patients)[0]; // Get the first key
              const firstPatient = patients[firstKey]; // Access the first valu
              navigate('/programmer', {
                state: {
                  patient: firstPatient,
                  timeline: arg.patientname[0],
                  directoryPath,
                  leadDBS,
                },
              });
            }
          }
        } catch (error) {
          console.error('Error processing event:', error);
        }
      });
    } else {
      console.error('ipcRenderer is not available');
    }
  }, [patients]);

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPatient({ ...currentPatient, [name]: value });
  };

  // Add a new patient and save JSON file
  const addPatient = () => {
    const newPatient = {
      id: Date.now().toString(), // Generate a unique ID
      name: '',
      age: '',
      gender: '',
      diagnosis: '',
    };

    const updatedPatients = [...patients, newPatient];
    setPatients(updatedPatients);
    savePatientsToJson(updatedPatients); // Save to JSON
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

  const addColumn = (id, label) => {
    if (!columns.some((column) => column.id === id)) {
      setColumns([...columns, { id, label }]);
    } else {
      console.error('Column with this ID already exists');
    }
  };

  const removeColumn = (id) => {
    setColumns(columns.filter((column) => column.id !== id));
  };

  return (
    <div style={{ width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Typography
        variant="h3"
        style={{
          fontWeight: 'bold',
          marginBottom: '-20px',
          textAlign: 'center',
        }}
      >
        DBS Patient Database
      </Typography>

      <Container style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '-20px',
          }}
        >
          {/* Search Field */}
          {!editMode && (
            <TextField
              label="Search"
              variant="standard"
              margin="normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputLabelProps={{ style: { fontSize: '14px' } }}
              InputProps={{ style: { fontSize: '14px' } }}
            />
          )}
          <Button
            // variant="contained"
            // color="default"
            onClick={() => setEditMode((prev) => !prev)}
            style={{ width: '180px', marginLeft: 'auto' }}
          >
            {editMode ? 'Close Edit Mode' : 'Edit Table Columns'}
          </Button>
          {editMode && (
            <>
              <TextField
                label="New Column ID"
                value={newColumnId}
                onChange={(e) => setNewColumnId(e.target.value)}
                variant="outlined"
                size="small"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  addColumn(newColumnId, newColumnId);
                  setNewColumnId('');
                }}
              >
                Add Column
              </Button>
              <Select
                value={columnToDelete}
                onChange={(e) => setColumnToDelete(e.target.value)}
                displayEmpty
                style={{ minWidth: '150px' }}
              >
                <MenuItem value="" disabled>
                  Select column to delete
                </MenuItem>
                {columns.map((column) => (
                  <MenuItem key={column.id} value={column.id}>
                    {column.label}
                  </MenuItem>
                ))}
              </Select>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  removeColumn(columnToDelete);
                  setColumnToDelete('');
                }}
              >
                Remove Column
              </Button>
            </>
          )}

          {/* Add Patient Button */}
          {!editMode && (
            <div>
              <Button
                // variant="contained"
                // color="primary"
                onClick={addPatient}
                style={{
                  fontSize: '14px',
                  padding: '10px 20px',
                  // marginLeft: 'auto',
                }}
              >
                Add Patient
              </Button>
              <Button
                // variant="contained"
                // color="default"
                onClick={() => navigate('/groupstats')}
                style={{ marginLeft: '5px' }}
              >
                Group Stats
              </Button>
              <Button
                // variant="contained"
                // color="default"
                onClick={() => navigate('/niivue')}
                style={{ marginLeft: '5px' }}
              >
                NiiVue
              </Button>
              <Button
                style={{ marginLeft: '5px' }}
                onClick={handleButtonClick}
              >
                Import Stimulation Parameters
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx, .xls"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
        <TableContainer
          component={Paper}
          style={{ flex: 1, marginTop: '20px' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>ID</TableCell> */}
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'id'}
                    direction={orderBy === 'id' ? order : 'asc'}
                    onClick={() => handleRequestSort('id')}
                  >
                    ID
                  </TableSortLabel>
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell
                    style={{
                      cursor: editRowId === patient.id ? 'default' : 'pointer',
                      color: editRowId === patient.id ? 'black' : 'blue',
                    }}
                    onClick={
                      editRowId !== patient.id
                        ? () =>
                            navigate(`/patient/${patient.id}`, {
                              state: { patient },
                            })
                        : undefined
                    }
                  >
                    {editRowId === patient.id ? (
                      <TextField
                        value={editedPatient.id || ''}
                        name="id"
                        onChange={handleEditChange}
                      />
                    ) : (
                      patient.id
                    )}
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {editRowId === patient.id ? (
                        <TextField
                          value={editedPatient[column.id] || ''}
                          name={column.id}
                          onChange={handleEditChange}
                        />
                      ) : (
                        patient[column.id]
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    {editRowId === patient.id ? (
                      <>
                        <IconButton onClick={handleSaveClick} color="primary">
                          <Save />
                        </IconButton>
                        <IconButton
                          onClick={handleCancelClick}
                          color="secondary"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton
                          onClick={() => handleEditClick(patient)}
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
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <div>
        {/* {directoryPath && patients.length > 0 && (
          // <DatabaseStats patients={patients} directoryPath={directoryPath} />
          <button onClick={() => navigate('/groupstats')}>Group Stats</button>
        )} */}
      </div>
    </div>
  );
}

export default PatientDatabase;
