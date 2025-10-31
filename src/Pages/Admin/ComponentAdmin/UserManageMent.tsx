import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../../redux/store";
import { getArrAllUserActionThunk } from "../../../redux/reducers/UserReducer";
import { useEffect, useState, useMemo } from "react";
import { FaEdit, FaTrash, FaSortUp, FaSortDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { deleteUserAPIbyID } from "../../../API/UserAPI";
import { getRandomAvatar } from "../../../Utils/interceptor";
import { Modal } from "antd";

const UserManagement = () => {
  const dispatch: DispatchType = useDispatch();
  const { arrAllUser } = useSelector((state: RootState) => state.UserReducer);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 10;

  // Fetch all users
  useEffect(() => {
    dispatch(getArrAllUserActionThunk());
  }, [dispatch]);

  // Toggle dropdown
  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  // Sort ID
  const handleSortById = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Filter + Sort + Search (fix immutable bug)
  const filteredUsers = useMemo(() => {
    let filtered = [...arrAllUser];

    // Lọc theo role
    if (roleFilter !== "ALL") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }

    // ✅ Tối ưu tìm kiếm theo tên/email
    if (searchTerm.trim()) {
      const normalizeText = (text: string) =>
        text
          .trim()
          .replace(/\s+/g, " ")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase();

      const normalizedSearch = normalizeText(searchTerm);

      filtered = filtered.filter((u) => {
        const normalizedName = normalizeText(u.name);
        const normalizedEmail = normalizeText(u.email);
        return (
          normalizedName.includes(normalizedSearch) ||
          normalizedEmail.includes(normalizedSearch)
        );
      });
    }

    // Sắp xếp ID
    filtered.sort((a, b) => (sortOrder === "asc" ? a.id - b.id : b.id - a.id));

    return filtered;
  }, [arrAllUser, sortOrder, roleFilter, searchTerm]);

  // Pagination
  const startIndex = (currentPage - 1) * pageSize;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  // Delete user
  const [isModalOpen, setIsModalOpen] = useState(false);
  // State lưu ID user được chọn
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const showModal = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (selectedId === null) return;
    await deleteUserAPIbyID(selectedId);
    dispatch(getArrAllUserActionThunk());
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Select Role
  const handleSelectRole = (role: string) => {
    setCurrentPage(1);
    setRoleFilter(role);
    setIsDropdownOpen(false);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-gray-800"> User Management</h2>

        {/* Search box */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-80 border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 ">
            <tr>
              <th
                className="px-4 py-3 cursor-pointer border-b select-none"
                onClick={handleSortById}
              >
                <div className="flex items-center gap-1">
                  <span>ID</span>
                  {sortOrder === "asc" ? (
                    <FaSortUp className="text-gray-600" />
                  ) : (
                    <FaSortDown className="text-gray-600" />
                  )}
                </div>
              </th>

              <th className="px-4 py-3 border-b">Avatar</th>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Email</th>

              <th className="px-4 py-3 border-b relative">
                <div className="flex justify-between items-center cursor-pointer select-none">
                  <span>Role</span>
                  <div
                    className="relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown();
                    }}
                  >
                    <FaSortDown className="text-gray-600" />
                    {isDropdownOpen && (
                      <div className="absolute right-0 top-5 w-28 bg-white border rounded-md shadow-lg z-10">
                        {["ALL", "ADMIN", "USER"].map((role) => (
                          <div
                            key={role}
                            onClick={() => handleSelectRole(role)}
                            className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                              roleFilter === role
                                ? "bg-blue-50 text-blue-700 font-semibold"
                                : ""
                            }`}
                          >
                            {role}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </th>

              <th className="px-4 py-3 text-center border-b">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-2 font-medium">{user.id}</td>
                <td className="px-4 py-2">
                  <img
                    src={user.avatar || getRandomAvatar(user.id, 80)}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border"
                  />
                </td>
                <td
                  className="px-4 py-2 text-gray-900 max-w-[150px] truncate"
                  title={user.name}
                >
                  {user.name}
                </td>
                <td
                  className="px-4 py-2 text-gray-600 max-w-[200px] truncate"
                  title={user.email}
                >
                  {user.email}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                      user.role === "ADMIN"
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2 flex gap-2 justify-center">
                  <NavLink
                    to={`/admin/user/${user.id}`}
                    className="flex items-center gap-1 px-3 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-xs"
                  >
                    <FaEdit /> Update
                  </NavLink>
                  <button
                    className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                    onClick={() => showModal(user.id)} // ✅ truyền id vào modal
                  >
                    <FaTrash /> Delete
                  </button>
                  <Modal
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={null}
                    closable={false}
                    centered
                    maskClosable
                    styles={{
                      mask: {
                        backgroundColor: "rgba(0, 0, 0, 0.001)",
                        backdropFilter: "blur(6px)",
                      },
                      body: {
                        borderRadius: "1rem", // bo góc modal
                      },
                    }}
                  >
                    <div className="text-center p-2">
                      {/* Icon cảnh báo */}
                      <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center bg-red-100 text-red-500 rounded-full">
                        <FaTrash className="text-3xl" />
                      </div>

                      {/* Tiêu đề */}
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        Xác nhận xoá người dùng
                      </h2>

                      {/* Nội dung */}
                      <p className="text-gray-600 mb-6 text-base">
                        Bạn có chắc chắn muốn xoá người dùng này không?
                      </p>

                      {/* Hành động */}
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={handleCancel}
                          className="px-5 py-2 rounded-lg border border-gray-300 text-gray-600
          hover:text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-gray-200
          transition-all duration-200 shadow-sm active:scale-95"
                        >
                          Hủy
                        </button>

                        <button
                          onClick={handleOk}
                          className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold
          hover:bg-red-600 focus:ring-2 focus:ring-red-300
          transition-all duration-200 shadow-sm active:scale-95"
                        >
                          Xoá
                        </button>
                      </div>
                    </div>
                  </Modal>
                </td>
              </tr>
            ))}

            {currentUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-3">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md border text-sm ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Prev
          </button>

          <span className="text-sm font-medium text-gray-600">
            Trang {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md border text-sm ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
