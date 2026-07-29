import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export const dataContextAPI = createContext();

function DataContextProvider() {
  const [resultData, setResultData] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [maxJobs, setMaxJobs] = useState(0);
  const [graphType, setGraphType] = useState("");
  const [totalCompines, setTotalCompines] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios.get(
          `${API_URL}/get-data`,
        );

        const data = result.data.data;

        setResultData(data);

        // Total Jobs
        setTotalJobs(data.length);

        // Total Unique Companies
        const companies = new Set(
          data.map((item) => item.Company).filter(Boolean),
        );

        setTotalCompines(companies.size);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const getChartData = useCallback(
    (key) => {
      let highestJobs;

      if (key) {
        const count = resultData.reduce((acc, item) => {
          const value = item[key];

          if (value) {
            acc[value] = (acc[value] || 0) + 1;
          }

          return acc;
        }, {});

        const formattedData = Object.entries(count).map(([name, jobs]) => ({
          name,
          jobs,
        }));

        setChartData(formattedData);

        highestJobs = Math.max(...formattedData.map((item) => item.jobs), 0);
      } else {
        const data = [
          { name: "Company", jobs: 40 },
          { name: "Location", jobs: 25 },
          { name: "Job Type", jobs: 15 },
          { name: "Experience", jobs: 10 },
          { name: "Skills", jobs: 10 },
        ];

        setChartData(data);

        highestJobs = Math.max(...data.map((item) => item.jobs), 0);
      }

      setMaxJobs(highestJobs);
    },
    [resultData],
  );

  console.log(totalCompines, totalJobs, "total");

  const colors = [
    "#2563EB",
    "#DC2626",
    "#16A34A",
    "#EA580C",
    "#9333EA",
    "#0891B2",
    "#CA8A04",
    "#DB2777",
    "#4F46E5",
    "#059669",
    "#7C3AED",
    "#BE123C",
    "#0369A1",
    "#65A30D",
    "#B45309",
    "#C026D3",
    "#0F766E",
    "#1D4ED8",
    "#15803D",
    "#E11D48",
    "#A16207",
    "#6D28D9",
    "#0EA5E9",
    "#84CC16",
    "#F97316",
    "#14B8A6",
    "#F43F5E",
    "#8B5CF6",
    "#22C55E",
    "#3B82F6",
  ];

  return (
    <dataContextAPI.Provider
      value={{
        resultData,
        matchedJobs,
        setMatchedJobs,
        getChartData,
        chartData,
        maxJobs,
        graphType,
        setChartData,
        setGraphType,
        colors,
        totalCompines,
        totalJobs,
      }}
    >
      <Outlet />
    </dataContextAPI.Provider>
  );
}

export default DataContextProvider;
