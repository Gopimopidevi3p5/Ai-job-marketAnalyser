import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6">
      <h1 className="mb-8 text-2xl font-bold">Job Analyzer</h1>

      <nav className="flex flex-col gap-4">
        <NavLink
          to="/"
          className="rounded-lg px-4 py-3 hover:bg-blue-600"
        >
          📄 Upload Excel
        </NavLink>

        <NavLink
          to="/graphs"
          className="rounded-lg px-4 py-3 hover:bg-blue-600"
        >
          📊 Graphs
        </NavLink>

        <NavLink
          to="/resume"
          className="rounded-lg px-4 py-3 hover:bg-blue-600"
        >
          📑 Resume Uploaded
        </NavLink>

        <NavLink to="/jobs" className="rounded-lg px-4 py-3 hover:bg-blue-600">
          💼 All Jobs
        </NavLink>
      </nav>
    </div>
  );
}

export default Navbar;
