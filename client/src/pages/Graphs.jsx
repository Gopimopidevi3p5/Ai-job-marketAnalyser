import { useContext, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { dataContextAPI } from "../components/DataContextProvider";
import PieCharts from "../components/graphs/PieCharts";
import DropBox from "../components/graphs/DropBox";

function Graphs() {
  const { chartData, maxJobs, graphType, getChartData, colors, setGraphType } =
    useContext(dataContextAPI);
  useEffect(() => {
    if (chartData.length === 0) {
      setGraphType("select the your Graphs");
      getChartData(""); // uses the built-in fallback sample data
    }
  }, []);
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {/* Dropdown */}
      <div className="mb-6">
        <DropBox />
      </div>

      {/* Graphs */}
      <div className="flex gap-6">
        {/* Bar Chart */}
        <section className="w-[60%] h-140 bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-bold text-center mb-5">
            {graphType || "Select a Graph"}
          </h2>

          <div className="w-full h-[500px] ml-[-30px] mr-[-30px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  bottom: 80,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={90}
                />

                <YAxis allowDecimals={false} domain={[0, maxJobs]} />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="jobs"
                  name={graphType || "Jobs"}
                  label={{ position: "top" }}
                  radius={[6, 6, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Pie Chart */}
        <section className="w-[40%] bg-white rounded-xl shadow-lg p-5">
          <h2 className="text-2xl font-bold text-center mb-5">Distribution</h2>

          <div>
            <PieCharts />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Graphs;
