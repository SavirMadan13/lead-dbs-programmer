import React, { useState, createContext, useContext } from 'react';

// Create a context to manage the state for each tab
export const TabStateContext = createContext();

export function useTabState() {
  return useContext(TabStateContext);
}

export function TabStateProvider({ children }) {
  const [tab1State, setTab1State] = useState({ unit: 'V', value: '' });
  const [tab2State, setTab2State] = useState({ unit: 'V', value: '' });
  const [tab3State, setTab3State] = useState({ unit: 'V', value: '' });
  const [tab4State, setTab4State] = useState({ unit: 'V', value: '' });

  return (
    <TabStateContext.Provider
      value={{
        tab1State,
        setTab1State,
        tab2State,
        setTab2State,
        tab3State,
        setTab3State,
        tab4State,
        setTab4State,
      }}
    >
      {children}
    </TabStateContext.Provider>
  );
}
