/**
 * Patient Context
 * 
 * This module provides a React context for managing patient data across the application.
 * It provides a centralized way to share patient information between components
 * without prop drilling.
 */

import React, { createContext, useState, useContext, ReactNode } from 'react';

/**
 * Patient data interface
 */
export interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  diagnosis?: string;
  [key: string]: any; // Allow additional properties
}

/**
 * Patient context value interface
 */
export interface PatientContextValue {
  /** Array of patient objects */
  patients: Patient[];
  /** Function to update the patients array */
  setPatients: (patients: Patient[]) => void;
  /** Function to add a new patient */
  addPatient: (patient: Patient) => void;
  /** Function to update an existing patient */
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  /** Function to remove a patient */
  removePatient: (id: string) => void;
  /** Function to get a patient by ID */
  getPatient: (id: string) => Patient | undefined;
  /** Function to clear all patients */
  clearPatients: () => void;
}

/**
 * Patient context
 */
export const PatientContext = createContext<PatientContextValue | undefined>(undefined);

/**
 * Props interface for PatientProvider
 */
interface PatientProviderProps {
  children: ReactNode;
}

/**
 * Patient Provider Component
 * 
 * Provides patient context to all child components.
 * Manages patient data state and provides utility functions for patient management.
 */
export function PatientProvider({ children }: PatientProviderProps): JSX.Element {
  const [patients, setPatients] = useState<Patient[]>([]);

  /**
   * Add a new patient to the list
   * @param patient - The patient object to add
   */
  const addPatient = (patient: Patient): void => {
    setPatients(prevPatients => [...prevPatients, patient]);
  };

  /**
   * Update an existing patient
   * @param id - The ID of the patient to update
   * @param updates - The updates to apply to the patient
   */
  const updatePatient = (id: string, updates: Partial<Patient>): void => {
    setPatients(prevPatients =>
      prevPatients.map(patient =>
        patient.id === id ? { ...patient, ...updates } : patient
      )
    );
  };

  /**
   * Remove a patient from the list
   * @param id - The ID of the patient to remove
   */
  const removePatient = (id: string): void => {
    setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
  };

  /**
   * Get a patient by ID
   * @param id - The ID of the patient to retrieve
   * @returns The patient object or undefined if not found
   */
  const getPatient = (id: string): Patient | undefined => {
    return patients.find(patient => patient.id === id);
  };

  /**
   * Clear all patients from the list
   */
  const clearPatients = (): void => {
    setPatients([]);
  };

  const contextValue: PatientContextValue = {
    patients,
    setPatients,
    addPatient,
    updatePatient,
    removePatient,
    getPatient,
    clearPatients,
  };

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
}

/**
 * Custom hook to use the patient context
 * @returns The patient context value
 * @throws Error if used outside of PatientProvider
 */
export function usePatientContext(): PatientContextValue {
  const context = useContext(PatientContext);
  
  if (context === undefined) {
    throw new Error('usePatientContext must be used within a PatientProvider');
  }
  
  return context;
}