import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { DispatchType, RootState } from "../../../redux/store";
import { getRoomDetailActionThunk } from "../../../redux/reducers/RoomReducer";
import { getAllLocaActionThunk } from "../../../redux/reducers/LocationReducer";
import RoomBooking from "./RoomBooking";
import { Helmet } from "react-helmet-async";

const RoomInfo = () => {
  const params = useParams();
  const { id } = params;
  const dispatch: DispatchType = useDispatch();

  const { roomDetail } = useSelector((state: RootState) => state.RoomReducer);
  const { arrAllLocation } = useSelector(
    (state: RootState) => state.LocationReducer
  );

  // ✅ Lấy chi tiết phòng
  useEffect(() => {
    if (id) dispatch(getRoomDetailActionThunk(id as any));
  }, [dispatch, id]);

  // ✅ Lấy danh sách vị trí nếu chưa có
  useEffect(() => {
    if (arrAllLocation.length === 0) {
      dispatch(getAllLocaActionThunk());
    }
  }, [dispatch, arrAllLocation.length]);

  // ✅ Tìm vị trí tương ứng
  const location = useMemo(() => {
    return arrAllLocation.find((loca) => loca.id === roomDetail?.maViTri);
  }, [arrAllLocation, roomDetail?.maViTri]);

  return (
    <>
      <Helmet>
        <title>
          {roomDetail?.tenPhong
            ? `${roomDetail.tenPhong} | Chi tiết phòng | AirBnB Clone`
            : "Chi tiết phòng | AirBnB Clone"}
        </title>
        <meta
          name="description"
          content="Đặt phòng du lịch, homestay, villa, khách sạn giá tốt nhất."
        />
      </Helmet>

      <div>
        {/* Hình ảnh */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img
            src={roomDetail?.hinhAnh}
            alt={roomDetail?.tenPhong}
            className="w-full h-96 object-cover rounded-2xl shadow"
          />
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, index) => (
              <img
                key={index}
                src={roomDetail?.hinhAnh}
                className="rounded-lg object-cover h-48"
                alt={`phòng ${index}`}
              />
            ))}
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tên phòng */}
            <div>
              <h1 className="text-3xl font-bold">{roomDetail?.tenPhong}</h1>
              <p className="text-gray-600">
                {roomDetail?.khach} khách · {roomDetail?.phongNgu} phòng ngủ ·{" "}
                {roomDetail?.giuong} giường · {roomDetail?.phongTam} phòng tắm
              </p>
              {location && (
                <p className="text-gray-500 mt-1">
                  📍 {location.tenViTri}, {location.tinhThanh}
                </p>
              )}
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
              <p className="text-gray-700 leading-relaxed">
                {roomDetail?.moTa}
              </p>
            </div>

            {/* ✅ Bản đồ vị trí */}
            {location && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-3">
                  Vị trí trên bản đồ
                </h2>
                <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
                  <iframe
                    title="Google Map"
                    src={`https://www.google.com/maps?q=${encodeURIComponent(
                      `${location.tenViTri}, ${location.tinhThanh}`
                    )}&output=embed`}
                    width="100%"
                    height="400"
                    loading="lazy"
                    className="w-full border-0"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          {/* Cột phải */}
          <RoomBooking />
        </div>
      </div>
    </>
  );
};

export default RoomInfo;
