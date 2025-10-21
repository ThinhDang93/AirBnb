import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../../redux/store";
import { DeleteRoomAPIbyID } from "../../../API/RoomAPI";
import { NavLink } from "react-router-dom";
import { useEffect } from "react";
import {
  getAllRoom,
  getRoomDetailActionThunk,
} from "../../../redux/reducers/RoomReducer";

const RoomManageMent = () => {
  const { arrAllroom } = useSelector((state: RootState) => state.RoomReducer);

  const dispatch: DispatchType = useDispatch();

  const handleDelete = (id: any) => {
    DeleteRoomAPIbyID(id);
  };

  const handleUpdate = (id: any) => {
    getRoomDetailActionThunk(id);
  };

  const getAllRoomAdmin = () => {
    dispatch(getAllRoom());
  };

  useEffect(() => {
    getAllRoomAdmin();
  }, [arrAllroom]);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Room Manager</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-3 border-b">ID</th>
              <th className="px-4 py-3 border-b">Hình ảnh</th>
              <th className="px-4 py-3 border-b">Tên phòng</th>
              <th className="px-4 py-3 border-b">Mã vị trí</th>
              <th className="px-4 py-3 border-b text-center">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {arrAllroom.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
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
                <td className="px-4 py-3 border-b">{room.maViTri}</td>
                <td className="px-4 py-3 border-b text-center">
                  <NavLink
                    to={`/admin/roomedit/${room.id}`}
                    onClick={() => handleUpdate(room.id)}
                    className="px-3 py-1 mr-2 text-sm bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition-colors"
                  >
                    Sửa
                  </NavLink>
                  <button
                    onClick={() => {
                      const isConfirmed = confirm(
                        "Bạn có chắc muốn xoá phòng này không?"
                      );
                      if (!isConfirmed) {
                        return;
                      }

                      handleDelete(room.id);
                      alert("Đã xoá thành công!");
                    }}
                    className="px-3 py-1 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomManageMent;
