import { FaMapMarkedAlt, FaCar, FaConciergeBell } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const MenuBar = () => {
  const baseClass =
    "flex items-center gap-2 px-3 py-2 text-xl font-semibold transition-colors duration-200";
  const activeClass =
    "text-blue-700 border-b-2 border-blue-700 md:border-none md:text-blue-700 md:dark:text-blue-500";
  const inactiveClass =
    "text-gray-700 hover:text-blue-700 dark:text-gray-600 md:dark:hover:text-blue-500";

  return (
    <div className="flex items-center justify-center">
      <ul className="flex flex-row space-x-6 md:space-x-10 ">
        {/* Places */}
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${baseClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaMapMarkedAlt className="text-lg " />
            Places
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
            <FaCar className="text-lg" />
            Vehicles
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
            <FaConciergeBell className="text-lg" />
            Services
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default MenuBar;
