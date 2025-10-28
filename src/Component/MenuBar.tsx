import { FaMapMarkedAlt, FaCar, FaConciergeBell } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const MenuBar = () => {
  const baseClass =
    "flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 text-lg md:text-xl font-semibold transition-colors duration-200";
  const activeClass =
    "text-blue-700 border-b-2 border-blue-700 md:border-none md:text-blue-700";
  const inactiveClass =
    "text-gray-700 hover:text-blue-700 dark:text-gray-600 md:dark:hover:text-blue-500";

  return (
    <div className="flex items-center justify-center w-full">
      <ul className="flex flex-row justify-around md:space-x-10 w-full max-w-md">
        {/* Places */}
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaMapMarkedAlt className="text-2xl md:text-lg" />
            <span className="hidden md:inline">Places</span>
          </NavLink>
        </li>

        {/* Vehicles */}
        <li>
          <NavLink
            to="/vehicle"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaCar className="text-2xl md:text-lg" />
            <span className="hidden md:inline">Vehicles</span>
          </NavLink>
        </li>

        {/* Services */}
        <li>
          <NavLink
            to="/service"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaConciergeBell className="text-2xl md:text-lg" />
            <span className="hidden md:inline">Services</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MenuBar;
