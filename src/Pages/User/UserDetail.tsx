import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../redux/store";
import { useEffect } from "react";
import { getUserDetailbyIDActionThunk } from "../../redux/reducers/UserReducer";
import { useParams } from "react-router-dom";
import { getBookingRoomDetailActionThunk } from "../../redux/reducers/RoomReducer";

const UserDetail = () => {
  const params = useParams();

  const { id } = params;

  const { userDetailbyID } = useSelector(
    (state: RootState) => state.UserReducer
  );
  const { roomBookingDetail } = useSelector(
    (state: RootState) => state.RoomReducer
  );

  const dispatch: DispatchType = useDispatch();

  const getUserDetail = () => {
    dispatch(getUserDetailbyIDActionThunk(id));
  };

  const getRoomBookingDetail = () => {
    dispatch(getBookingRoomDetailActionThunk(id));
  };

  useEffect(() => {
    getUserDetail(), getRoomBookingDetail();
  }, [userDetailbyID, roomBookingDetail]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-10">
      {/* Card thông tin user */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex gap-6">
        {/* Avatar */}
        <img
          src={userDetailbyID?.avatar || "https://i.pravatar.cc/150"}
          alt="avatar"
          className="w-36 h-36 rounded-full border-4 border-blue-100 shadow"
        />

        {/* Thông tin user chia 2 cột */}
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
              {userDetailbyID?.birthday}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">👤 Role:</span>{" "}
              {userDetailbyID?.role}
            </p>
          </div>

          <button className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition shadow">
            ✏️ Chỉnh sửa thông tin
          </button>
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
                <th className="px-6 py-3 border-b font-medium">Check-in</th>
                <th className="px-6 py-3 border-b font-medium">Check-out</th>
                <th className="px-6 py-3 border-b font-medium">Số khách</th>
                <th className="px-6 py-3 border-b font-medium text-center">
                  Chức năng
                </th>
              </tr>
            </thead>
            <tbody>
              {roomBookingDetail.map((b, idx) => (
                <tr
                  key={b.id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-blue-50 transition`}
                >
                  <td className="px-6 py-3 border-b">{b.ngayDi}</td>
                  <td className="px-6 py-3 border-b">{b.ngayDen}</td>
                  <td className="px-6 py-3 border-b">{b.soLuongKhach}</td>
                  <td className="px-6 py-3 border-b text-center space-x-2">
                    <button className="px-4 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition shadow">
                      ✏️ Sửa
                    </button>
                    <button className="px-4 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition shadow">
                      🗑️ Xoá
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
