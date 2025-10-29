/**
 * Patient Database Component
 * 
 * This component provides a comprehensive interface for managing patient data.
 * It includes features for viewing, editing, adding, and deleting patients,
 * as well as importing/exporting data and managing column visibility.
 */

import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
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
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Edit, Delete, Save, Cancel, Add, FileUpload, FileDownload } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

// Import context and components
import { PatientContext, Patient } from './PatientContext';
import DatabaseStats from './DatabaseStats';

/**
 * Props interface for PatientDatabase
 */
interface PatientDatabaseProps {
  /** The directory path for file operations */
  directoryPath: string | null;
}

/**
 * Column interface for table configuration
 */
interface Column {
  id: string;
  label: string;
}

/**
 * Patient Database Component
 * 
 * Provides a comprehensive interface for managing patient data with features for:
 * - Viewing and editing patient information
 * - Adding and deleting patients
 * - Importing/exporting data from Excel files
 * - Managing column visibility
 * - Sorting and searching
 */
export default function PatientDatabase({ directoryPath }: PatientDatabaseProps): JSX.Element {
  // Context
  const { patients, setPatients, addPatient, updatePatient, removePatient } = useContext(PatientContext);

  // State management
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editedPatient, setEditedPatient] = useState<Partial<Patient>>({});
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('id');
  const [editMode, setEditMode] = useState<boolean>(false);
  const [columns, setColumns] = useState<Column[]>([]);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set());
  const [newColumnId, setNewColumnId] = useState<string>('');
  const [newColumnLabel, setNewColumnLabel] = useState<string>('');
  const [columnToDelete, setColumnToDelete] = useState<string>('');
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  /**
   * Initialize columns from patient data
   */
  useEffect(() => {
    if (patients.length > 0) {
      const allColumnKeys = new Set<string>();
      patients.forEach((patient) => {
        Object.keys(patient).forEach((key) => {
          if (key !== 'PatientID' && key !== 'id') {
            allColumnKeys.add(key);
          }
        });
      });

      const updatedColumns = Array.from(allColumnKeys).map((columnKey) => ({
        id: columnKey,
        label: columnKey.charAt(0).toUpperCase() + columnKey.slice(1),
      }));

      setColumns(updatedColumns);
      setVisibleColumns(new Set(['City', 'Netstim / CBCT Publications', 'Condition', 'Target', 'elmodel']));
    }
  }, [patients]);

  /**
   * Toggle column visibility
   */
  const toggleColumnVisibility = useCallback((columnId: string): void => {
    setVisibleColumns((prevVisibleColumns) => {
      const newVisibleColumns = new Set(prevVisibleColumns);
      if (newVisibleColumns.has(columnId)) {
        newVisibleColumns.delete(columnId);
      } else {
        newVisibleColumns.add(columnId);
      }
      return newVisibleColumns;
    });
  }, []);

  /**
   * Handle file input click
   */
  const handleButtonClick = useCallback((): void => {
    fileInputRef.current?.click();
  }, []);

  /**
   * Handle file change for Excel import
   */
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          // Process imported data
          const processedData = jsonData.map((item: any, index: number) => ({
            ...item,
            id: item.id || `patient_${Date.now()}_${index}`,
          }));
          
          setPatients(processedData);
          setSnackbarMessage(`Successfully imported ${processedData.length} patients`);
          setSnackbarOpen(true);
        } catch (error) {
          console.error('Error importing file:', error);
          setSnackbarMessage('Error importing file');
          setSnackbarOpen(true);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [setPatients]);

  /**
   * Handle input changes for edited patient
   */
  const handleEditChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setEditedPatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  /**
   * Handle editing a patient
   */
  const handleEditClick = useCallback((patient: Patient): void => {
    setEditRowId(patient.id);
    setEditedPatient({ ...patient });
  }, []);

  /**
   * Save updated patient
   */
  const handleSaveClick = useCallback((): void => {
    if (editRowId && editedPatient) {
      updatePatient(editRowId, editedPatient);
      setEditRowId(null);
      setEditedPatient({});
      setSnackbarMessage('Patient updated successfully');
      setSnackbarOpen(true);
    }
  }, [editRowId, editedPatient, updatePatient]);

  /**
   * Cancel editing
   */
  const handleCancelClick = useCallback((): void => {
    setEditRowId(null);
    setEditedPatient({});
  }, []);

  /**
   * Handle patient deletion
   */
  const handleDeleteClick = useCallback((patientId: string): void => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      removePatient(patientId);
      setSnackbarMessage('Patient deleted successfully');
      setSnackbarOpen(true);
    }
  }, [removePatient]);

  /**
   * Handle sorting
   */
  const handleSort = useCallback((property: string): void => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  }, [order, orderBy]);

  /**
   * Handle search
   */
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  }, []);

  /**
   * Filter and sort patients
   */
  const filteredAndSortedPatients = React.useMemo(() => {
    let filtered = patients.filter((patient) =>
      Object.values(patient).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    filtered.sort((a, b) => {
      const aValue = a[orderBy] || '';
      const bValue = b[orderBy] || '';
      
      if (order === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [patients, searchTerm, order, orderBy]);

  /**
   * Handle column selection
   */
  const handleColumnSelection = useCallback((patientId: string): void => {
    setSelectedPatients((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(patientId)) {
        newSelected.delete(patientId);
      } else {
        newSelected.add(patientId);
      }
      return newSelected;
    });
  }, []);

  /**
   * Handle select all
   */
  const handleSelectAll = useCallback((): void => {
    if (selectedPatients.size === filteredAndSortedPatients.length) {
      setSelectedPatients(new Set());
    } else {
      setSelectedPatients(new Set(filteredAndSortedPatients.map(p => p.id)));
    }
  }, [selectedPatients.size, filteredAndSortedPatients]);

  /**
   * Render table header
   */
  const renderTableHeader = (): JSX.Element => (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={selectedPatients.size > 0 && selectedPatients.size < filteredAndSortedPatients.length}
            checked={filteredAndSortedPatients.length > 0 && selectedPatients.size === filteredAndSortedPatients.length}
            onChange={handleSelectAll}
          />
        </TableCell>
        {columns
          .filter((column) => visibleColumns.has(column.id))
          .map((column) => (
            <TableCell key={column.id}>
              <TableSortLabel
                active={orderBy === column.id}
                direction={orderBy === column.id ? order : 'asc'}
                onClick={() => handleSort(column.id)}
              >
                {column.label}
              </TableSortLabel>
            </TableCell>
          ))}
        <TableCell>Actions</TableCell>
      </TableRow>
    </TableHead>
  );

  /**
   * Render table body
   */
  const renderTableBody = (): JSX.Element => (
    <TableBody>
      {filteredAndSortedPatients.map((patient) => (
        <TableRow key={patient.id} selected={selectedPatients.has(patient.id)}>
          <TableCell padding="checkbox">
            <Checkbox
              checked={selectedPatients.has(patient.id)}
              onChange={() => handleColumnSelection(patient.id)}
            />
          </TableCell>
          {columns
            .filter((column) => visibleColumns.has(column.id))
            .map((column) => (
              <TableCell key={column.id}>
                {editRowId === patient.id ? (
                  <TextField
                    name={column.id}
                    value={editedPatient[column.id] || ''}
                    onChange={handleEditChange}
                    size="small"
                    fullWidth
                  />
                ) : (
                  patient[column.id] || ''
                )}
              </TableCell>
            ))}
          <TableCell>
            {editRowId === patient.id ? (
              <Box>
                <IconButton onClick={handleSaveClick} color="primary">
                  <Save />
                </IconButton>
                <IconButton onClick={handleCancelClick} color="secondary">
                  <Cancel />
                </IconButton>
              </Box>
            ) : (
              <Box>
                <IconButton onClick={() => handleEditClick(patient)} color="primary">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(patient.id)} color="error">
                  <Delete />
                </IconButton>
              </Box>
            )}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  /**
   * Render column management section
   */
  const renderColumnManagement = (): JSX.Element => (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Column Management</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">Visible Columns</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {columns.map((column) => (
              <Box key={column.id} sx={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  checked={visibleColumns.has(column.id)}
                  onChange={() => toggleColumnVisibility(column.id)}
                />
                <Typography>{column.label}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </AccordionDetails>
    </Accordion>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Database
          </Typography>
          <Button
            variant="contained"
            startIcon={<FileUpload />}
            onClick={handleButtonClick}
            sx={{ mr: 2 }}
          >
            Import Excel
          </Button>
          <Button
            variant="contained"
            startIcon={<FileDownload />}
            onClick={() => {
              // Export functionality would go here
              setSnackbarMessage('Export functionality coming soon');
              setSnackbarOpen(true);
            }}
          >
            Export
          </Button>
        </Toolbar>
      </AppBar>

      {/* Search */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <TextField
          fullWidth
          label="Search patients..."
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
        />
      </Box>

      {/* Column Management */}
      {renderColumnManagement()}

      {/* Table */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          {renderTableHeader()}
          {renderTableBody()}
        </Table>
      </TableContainer>

      {/* Database Stats */}
      <Box sx={{ mt: 4 }}>
        <DatabaseStats directoryPath={directoryPath} />
      </Box>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        style={{ display: 'none' }}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}