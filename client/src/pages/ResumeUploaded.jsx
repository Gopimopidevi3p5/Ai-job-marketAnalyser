import axios from "axios";
import { useCallback, useEffect, useState } from "react";

function ResumeUploaded() {
  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load saved jobs when component mounts
  useEffect(() => {
    const savedJobs =
      JSON.parse(localStorage.getItem("resumeMatchedJobs")) || [];

    setJobs(savedJobs);
  }, []);

  const analyzeResume = useCallback(
    async (e) => {
      e.preventDefault();

      if (!file) return;

      try {
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("resume", file);

        const result = await axios.post(
         "https://ai-job-market-analyser-proj.vercel.app/resume",
          formData,
        );

        const matchedJobs = result?.data?.data || [];

        // Save in state
        setJobs(matchedJobs);

        // Save in localStorage
        localStorage.setItem("resumeMatchedJobs", JSON.stringify(matchedJobs));

        // Clear file input state
        setFile(null);
      } catch (error) {
        console.log(error);

        setError(
          error?.response?.data?.message ||
            "Something went wrong analyzing your resume. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [file],
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Upload Section */}
      <div className="flex justify-center">
        <div className="w-[500px] rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="text-center text-3xl font-bold">
            Resume Job Matcher 🚀
          </h1>

          <form onSubmit={analyzeResume} className="mt-8">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-400 bg-blue-50 p-10 hover:bg-blue-100">
              <span className="text-5xl">📄</span>

              <p className="mt-3 font-semibold">
                {file ? file.name : "Upload PDF Resume"}
              </p>

              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  setFile(e.target.files[0]);
                }}
              />
            </label>

            <button
              type="submit"
              disabled={loading || !file}
              className="mt-6 w-full rounded-xl bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Analyzing Resume..." : "Find Matching Jobs"}
            </button>

            {error && <p className="mt-3 text-center text-red-600">{error}</p>}
          </form>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="rounded-xl bg-white p-6 shadow-lg transition hover:-translate-y-1"
          >
            <div className="flex justify-between gap-2">
              <h2 className="text-xl font-bold">{job?.["Job Title"]}</h2>

              {job?.matching_percentage && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-700">
                  {job.matching_percentage}%
                </span>
              )}
            </div>

            <p className="mt-2 font-semibold text-blue-600">{job?.Company}</p>

            <div className="mt-4 space-y-2 text-gray-600">
              <p>📍 {job?.Location}</p>
              <p>💼 {job?.Experience}</p>
              <p>🕒 {job?.["Job Type"]}</p>
              <p>🛠 {job?.Skills}</p>
              <p>💰 {job?.["Salary (LPA)"]} LPA</p>
              <p>📅 {job?.["Posted Date"]}</p>
            </div>

            <a
              href={job?.["Apply Link"]}
              target="_blank"
              rel="noreferrer"
              className="mt-5 block rounded-lg bg-blue-500 p-2 text-center text-white hover:bg-blue-700"
            >
              Apply Now
            </a>
          </div>
        ))}
      </div>

      {!loading && jobs.length === 0 && (
        <p className="mt-10 text-center text-gray-500">
          No matching jobs found yet. Upload a resume to get started.
        </p>
      )}
    </div>
  );
}

export default ResumeUploaded;
