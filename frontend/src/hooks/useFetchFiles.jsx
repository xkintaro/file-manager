import { useState } from 'react'
import { listFiles } from '../services/fileService';

function useFetchFiles() {
    const [allFiles, setAllFiles] = useState([]);

    const fetchFiles = async () => {
        try {
            const data = await listFiles();
            setAllFiles(data);
            console.log("fetchFiles, File list updated.");
        } catch (err) {
            console.error('Failed to retrieve file list:', err);
        }
    };

    return { allFiles, fetchFiles };
}

export default useFetchFiles;