import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
function AllJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const filteredJobs = jobs.filter((job) =>
    Object.values(job).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase()),
    ),
  );

  useEffect(() => {
    async function getJobs() {
      try {
        const result = await axios.get(`${API_URL}/get-data`);

        setJobs(result.data.data);
        console.log(result.data.data);
      } catch (error) {
        console.log(error);
      }
    }

    getJobs();
  }, []);

  return (
    <>
      <div className="sticky top-0 z-10 bg-gray-100 p-6">
        <input
          type="text"
          placeholder="🔍 Search by job title, company, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        {(search ? filteredJobs : jobs).map((job, index) => (
          <div
            key={index}
            className="rounded-xl border bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              {job["Job Title"]}
            </h2>

            <p className="mt-2 text-lg font-semibold text-blue-600">
              {job.Company}
            </p>

            <div className="mt-5 space-y-2 text-gray-600">
              <p>
                📍 <span className="font-medium">{job.Location}</span>
              </p>

              <p>
                💼 <span className="font-medium">{job.Experience}</span>
              </p>

              <p>
                🕒 <span className="font-medium">{job["Job Type"]}</span>
              </p>

              <p>
                💰{" "}
                <span className="font-medium">{job["Salary (LPA)"]} LPA</span>
              </p>

              <p>
                🛠 <span className="font-medium">{job.Skills}</span>
              </p>

              <p>
                📅 <span className="font-medium">{job["Posted Date"]}</span>
              </p>
            </div>

            <a
              href={job["Apply Link"]}
              target="_blank"
              rel="noreferrer"
              className="mt-6 block rounded-lg bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
            >
              Apply Now
            </a>
          </div>
        ))}
      </div>
    </>
  );
}

export default AllJobs;
