import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/img/Logo.png";
import { removeUserLogin } from "../redux/reducers/UserReducer";
import type { DispatchType, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";

const SlideBar = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch: DispatchType = useDispatch();
  const { userInfoLogin } = useSelector(
    (state: RootState) => state.UserReducer
  );

  const toggleMenu = (menu: string) =>
    setOpenMenu(openMenu === menu ? null : menu);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // ✅ Khi click vào item, sidebar sẽ tự đóng
  const handleItemClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div>
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 z-60 w-full bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 lg:px-6">
          <div className="flex items-center">
            {/* Toggle Sidebar (mobile only) */}
            <button
              onClick={toggleSidebar}
              className="inline-flex items-center p-2 text-gray-600 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <NavLink to="/admin" className="flex items-center ms-2">
              <img src={Logo} className="h-8 me-2" alt="AirBnb Logo" />
              <span className="text-xl font-semibold text-gray-900">
                AirBnb
              </span>
            </NavLink>
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 px-3 py-2 border rounded-full hover:shadow-md transition"
            >
              <img
                src={userInfoLogin?.avatar || "https://i.pravatar.cc/40"}
                className="w-8 h-8 rounded-full"
                alt="avatar"
              />
              <span className="hidden sm:inline font-medium text-black">
                {userInfoLogin?.name}
              </span>
              <svg
                className={`h-4 w-4 text-gray-500 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border shadow-lg rounded-xl overflow-hidden z-60">
                <NavLink
                  to={`/user/${userInfoLogin?.id}`}
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
                >
                  Dashboard
                </NavLink>

                {userInfoLogin?.role === "ADMIN" && (
                  <NavLink
                    to="/admin/room"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50"
                  >
                    Go to Admin Page
                  </NavLink>
                )}

                <hr />
                <button
                  onClick={() => {
                    navigate("/");
                    dispatch(removeUserLogin());
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ===== OVERLAY (mobile only) ===== */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden backdrop-blur-sm"
        ></div>
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-screen pt-20 bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0`}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto">
          <ul className="space-y-2 font-medium">
            {/* User */}
            <SidebarMenu
              title="User"
              open={openMenu === "menu1"}
              onClick={() => toggleMenu("menu1")}
              icon="👤"
              items={[
                { to: "/admin/useraddnew", label: "Add new" },
                { to: "/admin", label: "User Information" },
              ]}
              onItemClick={handleItemClick}
            />

            {/* Room */}
            <SidebarMenu
              title="Room"
              open={openMenu === "menu2"}
              onClick={() => toggleMenu("menu2")}
              icon="🏠"
              items={[
                { to: "/admin/roomaddnew", label: "Add new" },
                { to: "/admin/room", label: "Room Information" },
              ]}
              onItemClick={handleItemClick}
            />

            {/* Locate */}
            <SidebarMenu
              title="Locate"
              open={openMenu === "menu3"}
              onClick={() => toggleMenu("menu3")}
              icon="📍"
              items={[
                { to: "/admin/locateaddnew", label: "Add new" },
                { to: "/admin/locate", label: "Locate Information" },
              ]}
              onItemClick={handleItemClick}
            />

            {/* Booking */}
            <SidebarMenu
              title="Booking"
              open={openMenu === "menu4"}
              onClick={() => toggleMenu("menu4")}
              icon="🧾"
              items={[{ to: "/admin/booking", label: "Booking Information" }]}
              onItemClick={handleItemClick}
            />

            {/* Back Home */}
            <li>
              <NavLink
                to="/"
                onClick={handleItemClick}
                className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-800"
              >
                <span>🏡 Back to Home</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      {/* ===== CONTENT OFFSET ===== */}
      <div className="p-4 lg:ml-64 mt-16"></div>
    </div>
  );
};

// === Sub-component: Sidebar Menu ===
interface SidebarMenuProps {
  title: string;
  icon?: string;
  open: boolean;
  onClick: () => void;
  items: { to: string; label: string }[];
  onItemClick: () => void;
}

const SidebarMenu = ({
  title,
  icon,
  open,
  onClick,
  items,
  onItemClick,
}: SidebarMenuProps) => (
  <li>
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 text-gray-900"
    >
      <span className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        {title}
      </span>
      <svg
        className={`w-3 h-3 transition-transform text-gray-500 ${
          open ? "rotate-180" : ""
        }`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="m1 1 4 4 4-4"
        />
      </svg>
    </button>
    <ul
      className={`ml-6 mt-2 space-y-2 transition-all duration-300 ${
        open ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      {items.map((item) => (
        <li key={item.to}>
          <NavLink
            to={item.to}
            onClick={onItemClick}
            className="block p-2 rounded text-gray-700 hover:bg-gray-100"
          >
            {item.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </li>
);

export default SlideBar;
