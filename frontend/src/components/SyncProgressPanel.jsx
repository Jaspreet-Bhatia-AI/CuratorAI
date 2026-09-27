import React from 'react';
import { useSync } from '../context/SyncContext';

const SyncProgressPanel = () => {
  const { isSyncing, totalToSync, syncCompletedCount, activeDownloads } = useSync();

  if (!isSyncing) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-surface-container-high p-4 rounded-xl shadow-xl w-80 text-on-surface">
      <h3 className="text-lg font-semibold mb-2">Syncing Library</h3>
      <p className="text-sm mb-4">Downloading {syncCompletedCount} of {totalToSync}</p>
      
      <div className="space-y-3">
        {activeDownloads.map((download) => (
          <div key={download.id} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="truncate w-48" title={download.title}>{download.title}</span>
              <span>{download.progress}%</span>
            </div>
            <div className="w-full bg-surface-variant rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${download.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyncProgressPanel;
