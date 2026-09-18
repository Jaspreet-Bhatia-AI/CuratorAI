import { get, set } from 'idb-keyval';

// Key used to store the directory handle in IndexedDB
const DIR_HANDLE_KEY = 'curator_downloads_dir_handle';

export const getDirectoryHandle = async (promptUser = false) => {
  try {
    let handle = await get(DIR_HANDLE_KEY);
    
    if (handle) {
      const permission = await handle.queryPermission({ mode: 'readwrite' });
      if (permission === 'granted') {
        return handle;
      }
      if (promptUser && permission !== 'granted') {
        const newPerm = await handle.requestPermission({ mode: 'readwrite' });
        if (newPerm === 'granted') {
          return handle;
        }
      }
    }
    
    if (promptUser) {
      handle = await window.showDirectoryPicker({
        id: 'curator_downloads',
        mode: 'readwrite',
        startIn: 'downloads'
      });
      await set(DIR_HANDLE_KEY, handle);
      return handle;
    }
    
    return null;
  } catch (err) {
    console.error("FS API Error:", err);
    return null;
  }
};

export const saveFileToDisk = async (filename, blob) => {
  const dirHandle = await getDirectoryHandle(true);
  if (!dirHandle) throw new Error("Permission denied or directory not selected");
  
  const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(blob);
  await writable.close();
  return fileHandle;
};

export const loadFileFromDisk = async (filename) => {
  const dirHandle = await getDirectoryHandle(false);
  if (!dirHandle) return null;
  
  try {
    const fileHandle = await dirHandle.getFileHandle(filename, { create: false });
    const file = await fileHandle.getFile();
    return file; // File inherits from Blob!
  } catch (e) {
    return null;
  }
};

export const deleteFileFromDisk = async (filename) => {
  const dirHandle = await getDirectoryHandle(true);
  if (!dirHandle) return;
  try {
    await dirHandle.removeEntry(filename);
  } catch (e) {}
};
