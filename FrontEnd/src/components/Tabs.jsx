// components/Tabs.jsx
import { Link, useLocation } from "react-router-dom";

const Tabs = () => {
  const location = useLocation();
  const tabClass = (path) =>
    location.pathname === path
      ? "bg-blue-500 text-white px-4 py-2 rounded"
      : "bg-gray-200 text-gray-800 px-4 py-2 rounded";

  return (
    <div className="flex justify-center gap-4 my-4">
      <Link to="/" className={tabClass("/")}>📋 All Plans</Link>
      <Link to="/generate" className={tabClass("/generate")}>⚙️ Generate</Link>
    </div>
  );
};

export default Tabs;
