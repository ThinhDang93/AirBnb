import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../../redux/store";
import { DeleteRoomAPIbyID } from "../../../API/RoomAPI";
import { NavLink } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import {
  getAllRoom,
  getRoomDetailActionThunk,
} from "../../../redux/reducers/RoomReducer";
import { FaSortUp, FaSortDown, FaEdit, FaTrash } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { Modal } from "antd";

const RoomManagement = () => {
  const dispatch: DispatchType = useDispatch();
  const { arrAllroom } = useSelector((state: RootState) => state.RoomReducer);
  const { arrAllLocation } = useSelector(
    (state: RootState) => state.LocationReducer
  );

  // ✅ State cho search, filter & sort
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ✅ Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 9;

  useEffect(() => {
    dispatch(getAllRoom());
  }, [dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // State lưu ID user được chọn
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const showModal = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (selectedId === null) return;
    await DeleteRoomAPIbyID(selectedId);
    dispatch(getAllRoom());
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // ✅ Lấy thông tin vị trí
  const getLocationInfo = (maViTri: number) => {
    const found = arrAllLocation.find((p) => p.id === maViTri);
    return {
      tenViTri: found?.tenViTri || "—",
      tinhThanh: found?.tinhThanh || "—",
    };
  };

  // ✅ Lọc & sắp xếp
  const filteredRooms = useMemo(() => {
    let result = arrAllroom.filter((room) => {
      // Chuẩn hóa chuỗi tìm kiếm
      const normalizedSearch = searchTerm
        .trim() // loại bỏ khoảng trắng đầu cuối
        .replace(/\s+/g, " ") // gom các khoảng trắng liên tiếp thành 1
        .normalize("NFD") // bỏ dấu tiếng Việt
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const normalizedRoomName = room.tenPhong
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const matchesSearch = normalizedRoomName.includes(normalizedSearch);

      const matchesLocation =
        !filterLocation ||
        getLocationInfo(room.maViTri).tinhThanh === filterLocation;

      return matchesSearch && matchesLocation;
    });

    // ✅ Sắp xếp theo ID
    result = [...result].sort((a, b) =>
      sortOrder === "asc" ? a.id - b.id : b.id - a.id
    );

    return result;
  }, [arrAllroom, searchTerm, filterLocation, sortOrder]);

  // ✅ Phân trang sau khi lọc
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLocation]);

  // ✅ Toggle sắp xếp ID
  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  return (
    <>
      <Helmet>
        <title>Trang Quản trị | AirBnB Clone</title>
        <meta
          name="description"
          content="Đặt phòng du lịch, homestay, villa, khách sạn giá tốt nhất."
        />
      </Helmet>

      <div className="transition-all duration-300 lg:ml-64">
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              {" "}
              Room Management
            </h2>

            {/* Thanh tìm kiếm & filter */}
            <div className="flex flex-wrap gap-3">
              <input
                type="text"
                placeholder="🔍 Tìm theo tên phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="border px-3 py-2 rounded-lg text-sm w-56 focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">-- Lọc theo tỉnh thành --</option>
                {[...new Set(arrAllLocation.map((l) => l.tinhThanh))].map(
                  (city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  )
                )}
              </select>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterLocation("");
                }}
                className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Xoá lọc
              </button>
            </div>
          </div>

          {/* Bảng */}
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th
                    className="px-4 py-3 border-b cursor-pointer select-none"
                    onClick={toggleSortOrder}
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
                  <th className="px-4 py-3 border-b">Hình ảnh</th>
                  <th className="px-4 py-3 border-b">Tên phòng</th>
                  <th className="px-4 py-3 border-b">Quận / Huyện</th>
                  <th className="px-4 py-3 border-b">Thành phố</th>
                  <th className="px-4 py-3 border-b text-center">Chức năng</th>
                </tr>
              </thead>

              <tbody>
                {currentRooms.length > 0 ? (
                  currentRooms.map((room) => {
                    const { tenViTri, tinhThanh } = getLocationInfo(
                      room.maViTri
                    );
                    return (
                      <tr key={room.id} className="hover:bg-gray-50 transition">
                        <td className="px-4 py-3 border-b">{room.id}</td>
                        <td className="px-4 py-3 border-b">
                          <img
                            src={room.hinhAnh}
                            alt={room.tenPhong}
                            className="w-20 h-14 object-cover rounded-lg shadow-sm"
                          />
                        </td>
                        <td className="px-4 py-3 border-b font-medium">
                          {room.tenPhong}
                        </td>
                        <td className="px-4 py-3 border-b">{tenViTri}</td>
                        <td className="px-4 py-3 border-b">{tinhThanh}</td>
                        <td className="px-4 py-3 border-b">
                          <div className="flex justify-center gap-2">
                            <NavLink
                              to={`/admin/roomedit/${room.id}`}
                              onClick={() =>
                                dispatch(getRoomDetailActionThunk(room.id))
                              }
                              className="flex items-center gap-1 px-3 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-xs"
                            >
                              <FaEdit /> Update
                            </NavLink>
                            <button
                              className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                              onClick={() => showModal(room.id)} // ✅ truyền id vào modal
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
                                  Xác nhận xoá phòng
                                </h2>

                                {/* Nội dung */}
                                <p className="text-gray-600 mb-6 text-base">
                                  Bạn có chắc chắn muốn xoá thông tin phòng này
                                  không?
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
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Không tìm thấy phòng nào phù hợp.
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
      </div>
    </>
  );
};

export default RoomManagement;
