import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../../redux/store";
import { useEffect, useState, useMemo } from "react";
import { getArrAllBookingRoomActionThunk } from "../../../redux/reducers/BookingReducer";
import { getArrAllUserActionThunk } from "../../../redux/reducers/UserReducer";
import { getAllRoom } from "../../../redux/reducers/RoomReducer";
import { FaRegEye, FaTrash } from "react-icons/fa";
import { DeleteRoomBookingbyMaPhong } from "../../../API/RoomAPI";
import { NavLink } from "react-router-dom";
import { formatDate } from "../../../Utils/interceptor";
import { Helmet } from "react-helmet-async";
import { Modal } from "antd";

const BookingManageMent = () => {
  const dispatch: DispatchType = useDispatch();

  const { arrAllBookingRoom } = useSelector(
    (state: RootState) => state.BookingReducer
  );
  const { arrAllroom } = useSelector((state: RootState) => state.RoomReducer);
  const { arrAllUser } = useSelector((state: RootState) => state.UserReducer);

  // State tìm kiếm & phân trang
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const itemsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  // State lưu ID user được chọn
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const showModal = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (selectedId === null) return;
    await DeleteRoomBookingbyMaPhong(selectedId);
    dispatch(getArrAllBookingRoomActionThunk());
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(getArrAllBookingRoomActionThunk());
    dispatch(getAllRoom());
    dispatch(getArrAllUserActionThunk());
  }, [dispatch]);

  // Gộp dữ liệu booking + room + user
  const mergedData = useMemo(() => {
    return arrAllBookingRoom.map((b) => {
      const room = arrAllroom.find((r) => r.id === b.maPhong);
      const user = arrAllUser.find((u) => u.id === b.maNguoiDung);
      return {
        ...b,
        tenPhong: room?.tenPhong || "Không rõ",
        hinhAnh: room?.hinhAnh || "",
        name: user?.name || "Không rõ",
        maNguoiDung: b.maNguoiDung,
      };
    });
  }, [arrAllBookingRoom, arrAllroom, arrAllUser]);

  // Lọc dữ liệu theo search
  // Lọc dữ liệu theo search (bỏ dấu tiếng Việt, không phân biệt hoa thường)
  const filteredData = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (!normalizedSearch) return mergedData;

    return mergedData.filter((item) => {
      const normalizedRoomName = item.tenPhong
        ?.trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const normalizedUserName = item.name
        ?.trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      return (
        normalizedRoomName.includes(normalizedSearch) ||
        normalizedUserName.includes(normalizedSearch)
      );
    });
  }, [mergedData, search]);

  // Tính phân trang
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (pageIndex - 1) * itemsPerPage,
    pageIndex * itemsPerPage
  );

  return (
    <>
      <Helmet>
        <title>Trang Quản trị | AirBnB Clone</title>
        <meta
          name="description"
          content="Đặt phòng du lịch, homestay, villa, khách sạn giá tốt nhất."
        />
      </Helmet>

      <div className="transition-all duration-300 lg:ml-64 min-h-screen">
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Quản lý Booking
            </h2>
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPageIndex(1);
              }}
              placeholder="🔍 Tìm theo tên phòng hoặc người dùng..."
              className="w-80 px-4 py-2 border  text-sm rounded-lg  focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700   font-semibold">
                <tr>
                  <th className="px-4 py-3">Hình ảnh</th>
                  <th className="px-4 py-3">Tên phòng</th>
                  <th className="px-4 py-3">Tên khách</th>
                  <th className="px-4 py-3">Ngày đến</th>
                  <th className="px-4 py-3">Ngày đi</th>
                  <th className="px-4 py-3">Số khách</th>
                  <th className="px-4 py-3 text-center">Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((b, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-50 transition duration-150"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={b.hinhAnh}
                        alt={b.tenPhong}
                        className="w-16 h-12 object-cover rounded-md border"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {b.tenPhong}
                    </td>
                    <td className="px-4 py-3">{b.name}</td>
                    <td className="px-4 py-3">{formatDate(b.ngayDen)}</td>
                    <td className="px-4 py-3">{formatDate(b.ngayDi)}</td>
                    <td className="px-4 py-3 text-center">{b.soLuongKhach}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-3">
                        <NavLink
                          to={`/admin/bookingedit/${b.id}/${b.maNguoiDung}/${b.maPhong}`}
                          className="flex items-center gap-1 px-3 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-xs"
                        >
                          <FaRegEye /> Info
                        </NavLink>
                        <button
                          className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                          onClick={() => showModal(b.id)} // ✅ truyền id vào modal
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
                              Xác nhận xoá thông tin đặt phòng
                            </h2>

                            {/* Nội dung */}
                            <p className="text-gray-600 mb-6 text-base">
                              Bạn có chắc chắn muốn xoá thông tin đặt phòng này
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
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-6 text-gray-500 italic"
                    >
                      Không tìm thấy dữ liệu phù hợp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => setPageIndex((p) => Math.max(p - 1, 1))}
              disabled={pageIndex === 1}
              className={`px-3 py-1 rounded-md border ${
                pageIndex === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "hover:bg-indigo-100"
              }`}
            >
              ← Trước
            </button>

            <span className="text-gray-700">
              Trang {pageIndex}/{totalPages}
            </span>

            <button
              onClick={() => setPageIndex((p) => Math.min(p + 1, totalPages))}
              disabled={pageIndex === totalPages || totalPages === 0}
              className={`px-3 py-1 rounded-md border ${
                pageIndex === totalPages || totalPages === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "hover:bg-indigo-100"
              }`}
            >
              Sau →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingManageMent;
