// routes/DashboardLayout.jsx
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  FileText,
  Share2,
  Settings,
  LogOut,
} from "lucide-react";

const mainMenuItems = [
  { name: "Dashboard", path: "/dashboard/home", icon: <Home size={18} /> },
  { name: "Content", path: "/dashboard/content", icon: <FileText size={18} /> },
];

export default function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your logout logic here
    // e.g., clear token/localStorage, then redirect:
    // localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen w-[100%] bg-gray-50">
      <aside className="w-64 bg-white shadow-lg p-6 flex flex-col justify-between">
        {/* Top Section */}
        <div>
          <h2 className="text-xl font-bold mb-6 text-gray-800">My Dashboard</h2>
          <nav className="space-y-2">
            {mainMenuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="space-y-2 pt-4 border-t">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <Settings size={18} />
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="w-[100%] overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
