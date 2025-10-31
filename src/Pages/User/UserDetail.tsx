import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { getUserDetailbyIDActionThunk } from "../../redux/reducers/UserReducer";
import { NavLink, useParams } from "react-router-dom";
import {
  getBookingRoomDetailActionThunk,
  getAllRoom,
} from "../../redux/reducers/RoomReducer";
import { DeleteRoomBookingbyMaPhong } from "../../API/RoomAPI";
import type { HomeRoomType } from "../../assets/Models/Room";
import { formatDate } from "../../Utils/interceptor";
import { Helmet } from "react-helmet-async";
import { Modal } from "antd";
import { FaTrash } from "react-icons/fa";

const UserDetail = () => {
  const params = useParams();
  const { id } = params;

  const { userDetailbyID } = useSelector(
    (state: RootState) => state.UserReducer
  );
  const { roomBookingDetail, arrAllroom } = useSelector(
    (state: RootState) => state.RoomReducer
  );

  const dispatch: DispatchType = useDispatch();

  const getRoomBookingDetail = (id: any) => {
    dispatch(getBookingRoomDetailActionThunk(id));
  };

  const getAllRoomAPI = () => {
    dispatch(getAllRoom());
  };

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
    getRoomBookingDetail(id);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // 1️⃣ Lấy chi tiết user
  useEffect(() => {
    if (id) {
      dispatch(getUserDetailbyIDActionThunk(id));
    }
  }, [id, dispatch]);

  // 2️⃣ Lấy danh sách phòng đã đặt của user
  useEffect(() => {
    getRoomBookingDetail(id);
  }, [id]);

  // 3️⃣ Lấy danh sách tất cả phòng (chỉ 1 lần khi load)
  useEffect(() => {
    getAllRoomAPI();
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {userDetailbyID?.name
            ? `${userDetailbyID.name} | Dashboard | AirBnB Clone`
            : "Dashboard | AirBnB Clone"}
        </title>
        <meta
          name="description"
          content="Đặt phòng du lịch, homestay, villa, khách sạn giá tốt nhất."
        />
      </Helmet>

      <div className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Card thông tin user */}
        <div className="bg-white shadow-lg rounded-2xl p-6 flex gap-6">
          <img
            src={userDetailbyID?.avatar || "https://i.pravatar.cc/150"}
            alt="avatar"
            className="w-36 h-36 rounded-full border-4 border-blue-100 shadow"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              {userDetailbyID?.name}
            </h2>
            <div className="grid grid-cols-2 gap-y-3 gap-x-8">
              <p className="text-gray-700">
                <span className="font-semibold">📧 Email:</span>{" "}
                {userDetailbyID?.email}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">📱 Phone:</span>{" "}
                {userDetailbyID?.phone}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">🎂 Birthday:</span>{" "}
                {formatDate(userDetailbyID?.birthday!)}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">👤 Role:</span>{" "}
                {userDetailbyID?.role}
              </p>
            </div>
            <NavLink to={`/user/edit/${userDetailbyID?.id}`}>
              <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition shadow">
                ✏️ Chỉnh sửa thông tin
              </button>
            </NavLink>
          </div>
        </div>

        {/* Bảng danh sách phòng đã đặt */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">
            🏠 Danh sách phòng đã đặt
          </h3>
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700">
                  <th className="px-6 py-3 border-b font-medium">Hình ảnh</th>
                  <th className="px-6 py-3 border-b font-medium">Tên phòng</th>
                  <th className="px-6 py-3 border-b font-medium">Check-in</th>
                  <th className="px-6 py-3 border-b font-medium">Check-out</th>
                  <th className="px-6 py-3 border-b font-medium">Số khách</th>
                  <th className="px-6 py-3 border-b font-medium text-center">
                    Chức năng
                  </th>
                </tr>
              </thead>
              <tbody>
                {roomBookingDetail.map((b, idx) => {
                  const room = arrAllroom.find(
                    (room: HomeRoomType) => room.id === b.maPhong
                  );

                  return (
                    <tr
                      key={b.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-6 py-3 border-b">
                        <img
                          src={room?.hinhAnh || "https://i.pravatar.cc/80"}
                          alt={room?.tenPhong}
                          className="w-20 h-16 object-cover rounded-md shadow"
                        />
                      </td>
                      <td className="px-6 py-3 border-b">{room?.tenPhong}</td>
                      <td className="px-6 py-3 border-b">
                        {formatDate(b.ngayDen)}
                      </td>

                      <td className="px-6 py-3 border-b">
                        {formatDate(b.ngayDi)}
                      </td>
                      <td className="px-6 py-3 border-b">{b.soLuongKhach}</td>
                      <td className="px-6 py-3 border-b text-center">
                        <div className="flex items-center justify-center gap-4">
                          {/* Nút Sửa */}
                          <NavLink to={`/user/editbookingroom/${b.id}`}>
                            <button
                              className="flex items-center gap-2 px-5 py-2 bg-yellow-100 text-yellow-700 
                 rounded-full hover:bg-yellow-200 transition font-medium border border-yellow-300 shadow-sm"
                            >
                              ✏️ <span>Sửa</span>
                            </button>
                          </NavLink>
                          {/* Nút Xoá */}{" "}
                          <button
                            className="flex items-center gap-2 px-5 py-2 bg-red-200 text-red-700 
                 rounded-full hover:bg-red-400 transition font-medium border border-red-300 shadow-sm"
                            onClick={() => showModal(b.id)} // ✅ truyền id vào modal
                          >
                            ❌ <span>Huỷ</span>
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
                                Xác nhận huỷ đặt phòng
                              </h2>

                              {/* Nội dung */}
                              <p className="text-gray-600 mb-6 text-base">
                                Bạn có chắc chắn muốn huỷ phòng đặt này không?
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDetail;
