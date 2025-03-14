import React from 'react';

const DependenciesContext = React.createContext();

export const useDependencies = () => React.useContext(DependenciesContext);

export const DependenciesProvider = ({ children, dependencies }) => (
  <DependenciesContext.Provider value={dependencies}>
    {children}
  </DependenciesContext.Provider>
);
