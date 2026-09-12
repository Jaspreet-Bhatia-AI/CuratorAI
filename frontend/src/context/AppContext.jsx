import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [hasSearched, setHasSearched] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  return (
    <AppContext.Provider value={{
      hasSearched, setHasSearched,
      roadmap, setRoadmap,
      videos, setVideos,
      selectedTopic, setSelectedTopic
    }}>
      {children}
    </AppContext.Provider>
  );
};
