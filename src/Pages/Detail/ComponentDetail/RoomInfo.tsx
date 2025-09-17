import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { DispatchType, RootState } from "../../../redux/store";
import { getRoomDetailActionThunk } from "../../../redux/reducers/RoomReducer";

const RoomInfo = () => {
  const params = useParams();
  const { id } = params;
  const dispatch: DispatchType = useDispatch();

  const { roomDetail } = useSelector((state: RootState) => state.RoomReducer);

  const getRoomDetailAPI = () => {
    dispatch(getRoomDetailActionThunk(id as string));
  };

  useEffect(() => {
    getRoomDetailAPI();
  }, []);
  return (
    <div>
      {/* Hình ảnh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <img
          src={roomDetail?.hinhAnh}
          alt={roomDetail?.tenPhong}
          className="w-full h-96 object-cover rounded-2xl shadow"
        />
        {/* Ảnh phụ hoặc giữ nguyên một ảnh */}
        <div className="grid grid-cols-2 gap-2">
          <img
            src={roomDetail?.hinhAnh}
            className="rounded-lg object-cover h-48"
          />
          <img
            src={roomDetail?.hinhAnh}
            className="rounded-lg object-cover h-48"
          />
          <img
            src={roomDetail?.hinhAnh}
            className="rounded-lg object-cover h-48"
          />
          <img
            src={roomDetail?.hinhAnh}
            className="rounded-lg object-cover h-48"
          />
        </div>
      </div>

      {/* Thông tin chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: thông tin phòng */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tên + thông tin */}
          <div>
            <h1 className="text-3xl font-bold">{roomDetail?.tenPhong}</h1>
            <p className="text-gray-600">
              {roomDetail?.khach} khách · {roomDetail?.phongNgu} phòng ngủ ·{" "}
              {roomDetail?.giuong} giường · {roomDetail?.phongTam} phòng tắm
            </p>
          </div>

          {/* Tiện nghi */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Tiện nghi</h2>
            <ul className="grid grid-cols-2 gap-3 text-gray-700">
              {roomDetail?.mayGiat && <li>🧺 Máy giặt</li>}
              {roomDetail?.banLa && <li>🧴 Bàn là</li>}
              {roomDetail?.tivi && <li>📺 Tivi</li>}
              {roomDetail?.dieuHoa && <li>❄️ Điều hòa</li>}
              {roomDetail?.wifi && <li>📶 Wifi</li>}
              {roomDetail?.bep && <li>🍳 Bếp</li>}
              {roomDetail?.doXe && <li>🚗 Chỗ đỗ xe</li>}
              {roomDetail?.hoBoi && <li>🏊 Hồ bơi</li>}
              {roomDetail?.banUi && <li>🪞 Bàn ủi</li>}
            </ul>
          </div>

          {/* Mô tả */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
            <p className="text-gray-700 leading-relaxed">{roomDetail?.moTa}</p>
          </div>
        </div>

        {/* Cột phải: Booking Box */}
        <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-24 h-fit">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-gray-900">
              {roomDetail?.giaTien.toLocaleString("vi-VN")}₫
            </span>
            <span className="text-gray-500">/ đêm</span>
          </div>

          <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-lg shadow">
            Đặt phòng
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;

/**
 * Tách component RoomDetail -> Thêm component CommentViewer
 */
