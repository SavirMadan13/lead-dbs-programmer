import React, { createContext, useState } from 'react';

// Create the context
export const PatientContext = createContext();

// Create a provider component
export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);

  return (
    <PatientContext.Provider value={{ patients, setPatients }}>
      {children}
    </PatientContext.Provider>
  );
}
