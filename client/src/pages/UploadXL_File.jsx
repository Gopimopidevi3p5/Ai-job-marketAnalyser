import axios from "axios";
import { useRef, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
function UploadXL_File() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fileRef = useRef(null);

  function selectFile(e) {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  }

  async function fileSendServer() {
    try {
      if (!file) {
        setMessage("Please select an Excel file");
        return;
      }

      setLoading(true);
      setMessage("");

      const formData = new FormData();
      formData.append("excel", file);

      const result = await axios.post(
          `${API_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(result.data.data.excelSheetData, "data");
      setMessage("Excel file uploaded successfully");

      // Clear selected file
      setFile(null);

      if (fileRef.current) {
        fileRef.current.value = "";
      }
    } catch (error) {
      console.log(error);

      setMessage(error.response?.data?.message || "File upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 rounded-3xl bg-gradient-to-r from-blue-700 to-indigo-700 p-12 text-white shadow-2xl lg:grid-cols-2">
          {/* Left Section */}
          <div>
            <h1 className="text-5xl font-extrabold">Job Market Analyzer</h1>

            <p className="mt-6 text-lg leading-8 text-blue-100">
              <span className="font-semibold text-white">
                Job Market Analyzer
              </span>{" "}
              is an AI-powered platform that helps job seekers, students, and
              recruiters understand the current job market by analyzing
              thousands of job postings collected from multiple job platforms.
            </p>

            <p className="mt-5 text-lg leading-8 text-blue-100">
              Upload job data in Excel format, explore interactive analytics,
              visualize hiring trends, filter jobs based on your preferences,
              and discover opportunities that match your skills and experience.
              Upload your resume to receive AI-powered job recommendations with
              matching percentages.
            </p>
          </div>

          {/* Upload Card */}
          <div className="flex justify-center">
            <div className="w-[450px] rounded-2xl bg-white p-8 shadow-lg">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-5xl">
                  📄
                </div>

                <h1 className="text-3xl font-bold text-gray-800">
                  Excel Data Upload
                </h1>

                <p className="mt-2 text-gray-500">
                  Upload your Excel sheet and store data securely
                </p>
              </div>

              <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 p-8 hover:bg-blue-100">
                <div className="text-4xl">📂</div>

                <p className="mt-3 font-medium text-gray-700">
                  {file ? file.name : "Click to upload Excel file"}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Supports .xlsx and .xls files
                </p>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={selectFile}
                />
              </label>

              <button
                onClick={fileSendServer}
                disabled={!file || loading}
                className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {loading ? "Uploading..." : "Upload Excel"}
              </button>

              {message && (
                <p className="mt-4 text-center font-semibold text-gray-700">
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadXL_File;
