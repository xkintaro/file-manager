import { useEffect } from "react";
import useFetchFiles from "./hooks/useFetchFiles";
import useFetchTags from "./hooks/useFetchTags";
import FileList from './components/file/FileList'

function App() {
  const { allFiles, fetchFiles } = useFetchFiles();
  const { allTags, fetchTags } = useFetchTags();

  useEffect(() => {
    fetchFiles();
    fetchTags();
  }, []);


  return (
    <FileList allFiles={allFiles} allTags={allTags} fetchTags={fetchTags} />
  );
}

export default App;