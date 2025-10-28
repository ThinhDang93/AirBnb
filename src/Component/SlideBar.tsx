import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/img/Logo.png";
import { removeUserLogin } from "../redux/reducers/UserReducer";
import type { DispatchType, RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";

const SlideBar = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const { userInfoLogin } = useSelector(
    (state: RootState) => state.UserReducer
  );

  const toggleMenu = (menu: any) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };
  const toggleDropdown = () => setOpen(!open);

  const [open, setOpen] = useState(false);

  const dispatch: DispatchType = useDispatch();

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <NavLink to={"/admin"} className="flex ms-2 md:me-24">
                <img src={Logo} className="h-8 me-3" alt="AirBnb Logo" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">
                  AirBnb
                </span>
              </NavLink>
            </div>
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
                <span className="font-medium text-white">
                  {userInfoLogin?.name}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white border shadow-lg rounded-xl overflow-hidden">
                  {/* Dashboard */}
                  <NavLink
                    to={`/user/${userInfoLogin?.id}`}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    onClick={() => setOpen(false)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                    <span className="font-medium">Dashboard</span>
                  </NavLink>

                  {/* ✅ Chỉ hiển thị nếu role là ADMIN */}
                  {userInfoLogin?.role === "ADMIN" && (
                    <NavLink
                      to="/admin/room"
                      className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
                      onClick={() => setOpen(false)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="font-medium">Go to Admin Page</span>
                    </NavLink>
                  )}

                  <hr className="border-t" />

                  {/* Logout */}
                  <button
                    onClick={() => {
                      navigate("/");
                      dispatch(removeUserLogin());
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-9V5"
                      />
                    </svg>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <div>
              <li>
                <button
                  onClick={() => toggleMenu("menu1")}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 20 18"
                    >
                      <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                    </svg>
                    <span>User</span>
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      openMenu === "menu1" ? "rotate-180" : ""
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
                  className={`ml-6 mt-2 space-y-2 transition-all ${
                    openMenu === "menu1"
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <li>
                    <NavLink
                      to={"/admin/useraddnew"}
                      className="block p-2 rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      Add new
                    </NavLink>
                  </li>

                  <li>
                    <NavLink
                      to={"/admin"}
                      className="block p-2 rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      User Infomation
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <button
                  onClick={() => toggleMenu("menu2")}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M17 5.923A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .923L.086 17.846A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.994-2.153L17 5.923ZM7 9a1 1 0 0 1-2 0V7h2v2Zm0-5a2 2 0 1 1 4 0v1H7V4Zm6 5a1 1 0 1 1-2 0V7h2v2Z" />
                    </svg>
                    <span>Room</span>
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      openMenu === "menu2" ? "rotate-180" : ""
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
                  className={`ml-6 mt-2 space-y-2 transition-all ${
                    openMenu === "menu2"
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <li>
                    <NavLink
                      to={"/admin/roomaddnew"}
                      className="block p-2 rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      Add New
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"/admin/room"}
                      className="block p-2 rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      Room Infomation
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <button
                  onClick={() => toggleMenu("menu3")}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-map-pin-icon lucide-map-pin shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx={12} cy={10} r={3} />
                    </svg>
                    <span>Locate</span>
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      openMenu === "menu3" ? "rotate-180" : ""
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
                  className={`ml-6 mt-2 space-y-2 transition-all ${
                    openMenu === "menu3"
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <li>
                    <NavLink
                      to={"/admin/locateaddnew"}
                      className="block p-2 rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      Add New
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to={"/admin/locate"}
                      className="block p-2 rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      Locate Infomation
                    </NavLink>
                  </li>
                </ul>
              </li>
              <li>
                <button
                  onClick={() => toggleMenu("menu4")}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-notebook-pen-icon lucide-notebook-pen shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                    >
                      <path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" />
                      <path d="M2 6h4" />
                      <path d="M2 10h4" />
                      <path d="M2 14h4" />
                      <path d="M2 18h4" />
                      <path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                    </svg>

                    <span>Booking</span>
                  </span>
                  <svg
                    className={`w-3 h-3 transition-transform ${
                      openMenu === "menu4" ? "rotate-180" : ""
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
                  className={`ml-6 mt-2 space-y-2 transition-all ${
                    openMenu === "menu4"
                      ? "max-h-40 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <li>
                    <NavLink
                      to={"/admin/booking"}
                      className="block p-2 rounded text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                    >
                      Booking Infomation
                    </NavLink>
                  </li>
                </ul>
              </li>

              <li>
                <NavLink
                  to={"/"}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <span className="flex items-center gap-2">
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={24}
                        height={24}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-house-icon lucide-house shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                      >
                        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                        <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      </svg>
                    </div>
                    <span>Back to HomePage</span>
                  </span>
                </NavLink>
              </li>
            </div>
          </ul>
        </div>
      </aside>
      <div className="p-4 sm:ml-64"></div>
    </div>
  );
};

export default SlideBar;
