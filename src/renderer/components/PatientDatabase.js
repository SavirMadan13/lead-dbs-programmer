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
  Typography,
  TableSortLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { PatientContext } from './PatientContext';

function PatientDatabase({ key, directoryPath }) {
  const { patients, setPatients } = useContext(PatientContext);
  const [editRowId, setEditRowId] = useState(null); // Track the row being edited
  const [editedPatient, setEditedPatient] = useState({}); // Hold the patient data while editing
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
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
        {/* Patient Table */}
        <Button
          variant="contained"
          color="default"
          onClick={() => setEditMode((prev) => !prev)}
          style={{
            width: '100px',
            marginLeft: '1000px',
            marginBottom: '-60px',
          }}
        >
          {editMode ? 'Close Edit Mode' : 'Edit Table'}
        </Button>

        {/* Conditionally render column management UI */}
        {editMode && (
          <div>
            <TextField
              label="New Column ID"
              value={newColumnId}
              onChange={(e) => setNewColumnId(e.target.value)}
              variant="outlined"
              size="small"
              style={{ marginRight: '10px' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                addColumn(newColumnId, newColumnId);
                setNewColumnId('');
                setNewColumnLabel('');
              }}
              style={{ marginRight: '10px' }}
            >
              Add Column
            </Button>
            <Select
              value={columnToDelete}
              onChange={(e) => setColumnToDelete(e.target.value)}
              displayEmpty
              style={{
                marginLeft: '20px',
                marginRight: '10px',
                minWidth: '150px',
              }}
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
          </div>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={addPatient}
          style={{
            fontSize: '14px',
            padding: '10px 20px',
            marginBottom: '20px',
            width: '150px',
          }}
        >
          Add Patient
        </Button>
        <TableContainer
          component={Paper}
          style={{ flex: 1, marginTop: '20px' }}
        >
          <Table>
            {/* <TableHead>
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
            </TableHead> */}
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
            {/* <TableBody>
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
                  <TableCell onClick={() => handleEditClick(patient)}>
                    {editRowId === patient.id ? (
                      <TextField
                        value={editedPatient.name || ''}
                        name="name"
                        onChange={handleEditChange}
                      />
                    ) : (
                      patient.name
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleEditClick(patient)}>
                    {editRowId === patient.id ? (
                      <TextField
                        value={editedPatient.age || ''}
                        name="age"
                        onChange={handleEditChange}
                      />
                    ) : (
                      patient.age
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleEditClick(patient)}>
                    {editRowId === patient.id ? (
                      <TextField
                        value={editedPatient.gender || ''}
                        name="gender"
                        onChange={handleEditChange}
                      />
                    ) : (
                      patient.gender
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleEditClick(patient)}>
                    {editRowId === patient.id ? (
                      <TextField
                        value={editedPatient.diagnosis || ''}
                        name="diagnosis"
                        onChange={handleEditChange}
                      />
                    ) : (
                      patient.diagnosis
                    )}
                  </TableCell>
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
            </TableBody> */}
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
    </div>
  );
}

export default PatientDatabase;