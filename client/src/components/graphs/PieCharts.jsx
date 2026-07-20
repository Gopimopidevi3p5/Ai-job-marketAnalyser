import { useContext } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { dataContextAPI } from "../DataContextProvider";

function PieCharts() {
  const { chartData, colors } = useContext(dataContextAPI);

  return (
    <div className={`w-full h-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="jobs"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name, props) => {
              const totalNoOfJobs = chartData.reduce(
                (sum, item) => sum + item.jobs,
                0,
              );
              const percentage = ((value / totalNoOfJobs) * 100).toFixed();
              return [
                `${value} Jobs, ${percentage}% of Jobs`,
                props.payload.name,
              ];
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PieCharts;
