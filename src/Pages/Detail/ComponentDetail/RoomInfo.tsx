import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { DispatchType, RootState } from "../../../redux/store";
import { getRoomDetailActionThunk } from "../../../redux/reducers/RoomReducer";
import RoomBooking from "./RoomBooking";

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

        <RoomBooking />
      </div>
    </div>
  );
};

export default RoomInfo;
