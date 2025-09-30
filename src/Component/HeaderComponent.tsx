import { NavLink } from "react-router-dom";
import Search from "./Search";
import Logo from "../assets/img/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../redux/store";
import { useEffect, useState } from "react";
import { removeUserLogin } from "../redux/reducers/UserReducer";
import MenuBar from "./MenuBar";

export const HeaderComponent = () => {
  const { userInfoLogin } = useSelector(
    (state: RootState) => state.UserReducer
  );
  const [open, setOpen] = useState(false);
  const dispatch: DispatchType = useDispatch();

  const [isRolled, setIsRolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsRolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleDropdown = () => setOpen(!open);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300
        ${isRolled ? "bg-gray-100 shadow-md py-2" : "bg-gray-100 py-4"}
      `}
    >
      <div className="max-w-screen-xl mx-auto flex flex-col gap-2 px-4">
        {/* Logo + user */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="h-8" />
            <span className="font-bold text-xl">AirBnb</span>
          </NavLink>

          {/* Search bar (luôn hiển thị) */}
          <div className="flex-1 mx-8 items-center">
            {!isRolled && <MenuBar />}
            <Search />
          </div>

          {/* User login */}
          {userInfoLogin === null ? (
            <NavLink
              to="/login"
              className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            >
              Sign in
            </NavLink>
          ) : (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center gap-2 px-3 py-2 border rounded-full hover:shadow-md transition"
              >
                <img
                  src={userInfoLogin.avatar || "https://i.pravatar.cc/40"}
                  className="w-8 h-8 rounded-full"
                  alt="avatar"
                />
                <span className="font-medium">{userInfoLogin.name}</span>
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
                    to={`/user/${userInfoLogin.id}`}
                    className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
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

                  <hr className="border-t" />

                  {/* Logout */}
                  <button
                    onClick={() => dispatch(removeUserLogin())}
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
          )}
        </div>
      </div>
    </header>
  );
};
