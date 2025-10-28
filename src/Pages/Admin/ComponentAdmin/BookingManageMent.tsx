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

  const handleDelete = async (id: number) => {
    const isConfirmed = confirm("Bạn có chắc muốn xoá phòng đặt này không?");
    if (!isConfirmed) return;
    await DeleteRoomBookingbyMaPhong(id);
    alert("Đã xoá thành công!");
    dispatch(getArrAllBookingRoomActionThunk());
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
  const filteredData = useMemo(() => {
    const lower = search.toLowerCase();
    return mergedData.filter(
      (item) =>
        item.tenPhong.toLowerCase().includes(lower) ||
        item.name.toLowerCase().includes(lower)
    );
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

      <div className="p-5 sm:ml-64 min-h-screen">
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
              placeholder="Tìm theo tên phòng hoặc người dùng..."
              className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-400"
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
                          onClick={() => {
                            handleDelete(b.id);
                          }}
                        >
                          <FaTrash /> Delete
                        </button>
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
