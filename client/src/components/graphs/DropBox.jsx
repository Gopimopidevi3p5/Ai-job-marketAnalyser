import { useContext } from "react";
import { dataContextAPI } from "../DataContextProvider";

function DropBox() {
  const {
    getChartData,
    graphType,
    setGraphType,
    totalJobs,
    totalCompines,
    resultData,
  } = useContext(dataContextAPI);

  return (
    <div className="grid grid-cols-3 gap-3">
      <section>
        <div className="w-64 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">
            Total Companies
          </h2>

          <p className="mt-3 text-4xl font-bold text-blue-600">
            {totalCompines}
          </p>
        </div>
      </section>
      <section>
        <div className="w-64 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-600">Total Jobs</h2>

          <p className="mt-3 text-4xl font-bold text-blue-600">{totalJobs}</p>
        </div>
      </section>
      <section className="mt-10 mr-100 ">
        {/* <select
          value={graphType}
          onChange={(e) => {
            const value = e.target.value;
            setGraphType(value);
            getChartData(value);
          }}
          className="w-48 p-2 rounded-lg mt-0 bg-white"
        > */}
        <select
          value={graphType}
          onChange={(e) => {
            const value = e.target.value;
            setGraphType(value);
            getChartData(value);
          }}
          className="w-48 rounded-lg bg-white p-2"
        >
          {/* <option value="">select options</option> */}
          <option value="">Select Options</option>
          {/* {Object.keys(resultData[0])
            .filter((el) => el !== "Apply Link")
            .map((el) => {
              return (
                <option key={el} value={el}>
                  {el}
                </option>
              );
            })} */}
          {/* <option value="Company">Companys</option>
          <option value="Location">Locations</option>
          <option value="Job Type">Job Types</option>
          <option value="Experience">Experienceses</option>
          <option value="Job Title">Job Roles</option>
          <option value="Salary (LPA)">Salarys (LPA)</option>
          <option value="Skills">Skills</option> */}
          {resultData.length > 0 &&
            Object.keys(resultData[0])
              .filter((el) => el !== "Apply Link" && el !== "Job Description")
              .map((el) => (
                <option key={el} value={el}>
                  {el}
                </option>
              ))}
        </select>
        {/* </select> */}
      </section>
    </div>
  );
}
export default DropBox;
