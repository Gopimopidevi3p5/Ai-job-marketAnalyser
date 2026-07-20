import { BrowserRouter, Routes, Route } from "react-router-dom";
import UploadXL_File from "./pages/UploadXL_File";
import Navbar from "./pages/Navbar";
import AllJobs from "./pages/AllJobs";
import ResumeUploaded from "./pages/ResumeUploaded";
import Graphs from "./pages/Graphs";
import DataContextProvider from "./components/DataContextProvider";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <div className="h-screen w-64">
          <Navbar />
        </div>
        <div className="h-screen w-full  overflow-auto">
          <Routes>
            <Route path="/" element={<UploadXL_File />} />
            <Route element={<DataContextProvider />}>
              <Route path="/jobs" element={<AllJobs />} />
              <Route path="/resume" element={<ResumeUploaded />} />
              <Route path="/graphs" element={<Graphs />} />
            </Route>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
