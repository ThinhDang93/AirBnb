import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../../redux/store";
import { getArrAllUserActionThunk } from "../../../redux/reducers/UserReducer";
import { useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { deleteUserAPIbyID } from "../../../API/UserAPI";

const UserManageMent = () => {
  const { arrAllUser } = useSelector((state: RootState) => state.UserReducer);

  const dispatch: DispatchType = useDispatch();

  const getAllUserAPI = () => {
    dispatch(getArrAllUserActionThunk());
  };

  const handleDelete = (id: any) => {
    deleteUserAPIbyID(id);
  };
  useEffect(() => {
    getAllUserAPI();
  }, [arrAllUser]);
  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>

      <table className="w-full border border-gray-200 text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Avatar</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {arrAllUser.map((user) => (
            <tr
              key={user.id}
              className="border-b hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-2">{user.id}</td>
              <td className="px-4 py-2">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </td>
              {/* Name */}
              <td
                className="px-4 py-2 font-medium text-gray-900 max-w-[150px] truncate whitespace-nowrap"
                title={user.name}
              >
                {user.name}
              </td>
              {/* Email */}
              <td
                className="px-4 py-2 text-gray-600 max-w-[200px] truncate whitespace-nowrap"
                title={user.email}
              >
                {user.email}
              </td>
              {/* Actions */}
              <td className="px-4 py-2 flex gap-2 pt-4">
                <NavLink
                  to={`/admin/user/${user.id}`}
                  className="flex items-center gap-1 px-4 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
                >
                  <FaEdit /> Update
                </NavLink>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex items-center gap-1 px-4 py-2.5 bg-red-500 text-white rounded-md  hover:bg-red-600 text-xs"
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManageMent;
