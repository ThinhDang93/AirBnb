import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../../redux/store";
import { NavLink } from "react-router-dom";
import {
  getAllLocaActionThunk,
  getArrLocaByPage,
} from "../../../redux/reducers/LocationReducer";
import { useEffect, useMemo, useState } from "react";
import type { LocationType } from "../../../assets/Models/Location";
import { DeleteLocaById } from "../../../API/LocationAPI";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Helmet } from "react-helmet-async";
import { Modal } from "antd";

const LocateManageMent = () => {
  const dispatch: DispatchType = useDispatch();

  const { arrAllLocation, arrAllLocationByPage } = useSelector(
    (state: RootState) => state.LocationReducer
  );

  const [pageIndex, setPageIndex] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const getArrLocaByPageAPI = (pageIndex: number) => {
    const action = getArrLocaByPage(pageIndex);
    dispatch(action);
  };

  const getArrAllLocaAPI = () => {
    const action = getAllLocaActionThunk();
    dispatch(action);
  };

  useEffect(() => {
    getArrAllLocaAPI();
  }, []);

  useEffect(() => {
    getArrLocaByPageAPI(pageIndex);
  }, [pageIndex]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  // State lưu ID user được chọn
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const showModal = (id: number) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    if (selectedId === null) return;
    await DeleteLocaById(selectedId);
    getArrLocaByPageAPI(pageIndex);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const filteredLocation = useMemo(() => {
    const normalizedSearch = searchTerm
      .trim()
      .replace(/\s+/g, " ") // gộp khoảng trắng
      .normalize("NFD") // bỏ dấu tiếng Việt
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    if (!normalizedSearch) return arrAllLocationByPage;

    return arrAllLocation.filter((loca: LocationType) => {
      const normalizedName = loca.tenViTri
        ?.trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      const normalizedProvince = loca.tinhThanh
        ?.trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

      return (
        normalizedName.includes(normalizedSearch) ||
        normalizedProvince.includes(normalizedSearch)
      );
    });
  }, [searchTerm, arrAllLocation, arrAllLocationByPage]);

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
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Locate Management
            </h2>
            <div className="flex gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên hoặc tỉnh thành..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 border px-4 py-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* Bảng */}
          <div className="overflow-x-auto bg-white shadow rounded-xl">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 text-gray-700   font-semibold">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Hình ảnh</th>
                  <th className="py-3 px-4 text-left">Tên vị trí</th>
                  <th className="py-3 px-4 text-left">Tỉnh thành</th>
                  <th className="py-3 px-4 text-left">Quốc gia</th>
                  <th className="py-3 px-4 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredLocation?.length > 0 ? (
                  filteredLocation.map((loca: LocationType) => (
                    <tr
                      key={loca.id}
                      className="border-t hover:bg-gray-50 transition"
                    >
                      <td className="py-3 px-4">{loca.id}</td>
                      <td className="py-3 px-4">
                        <img
                          src={loca.hinhAnh}
                          alt={loca.tenViTri}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {loca.tenViTri}
                      </td>
                      <td className="py-3 px-4">{loca.tinhThanh}</td>
                      <td className="py-3 px-4">{loca.quocGia}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center gap-3">
                          <NavLink
                            to={`/admin/locateedit/${loca.id}`}
                            className="flex items-center gap-1 px-3 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 text-xs"
                          >
                            <FaEdit /> Update
                          </NavLink>
                          <button
                            className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                            onClick={() => showModal(loca.id)} // ✅ truyền id vào modal
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
                                Xác nhận xoá vị trí
                              </h2>

                              {/* Nội dung */}
                              <p className="text-gray-600 mb-6 text-base">
                                Bạn có chắc chắn muốn xoá vị trí này không?
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
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-6 text-center text-gray-500 italic"
                    >
                      Không tìm thấy vị trí nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {searchTerm.trim() === "" && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={() => setPageIndex((prev) => Math.max(prev - 1, 1))}
                disabled={pageIndex === 1}
                className={`px-4 py-2 rounded-lg border ${
                  pageIndex === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
              >
                ← Trước
              </button>
              <span className="text-gray-700 font-medium">
                Trang {pageIndex}
              </span>
              <button
                onClick={() => setPageIndex((prev) => prev + 1)}
                className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-100 text-gray-700"
              >
                Sau →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LocateManageMent;
