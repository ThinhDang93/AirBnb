import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../../redux/store";
import type { BookingRoomType } from "../../../assets/Models/Room";
import { UpdateRoomBooking } from "../../../API/RoomAPI";
import {
  getRoomBookingUpdateActionThunk,
  getRoomDetailBookingActionThunk,
} from "../../../redux/reducers/RoomReducer";
import { useNavigate, useParams } from "react-router-dom";
import { showAlert } from "../../../redux/reducers/AlertReducer";

// Hàm format ngày BE -> UI (YYYY-MM-DD)
const formatDate = (dateString?: string) =>
  dateString ? dateString.split("T")[0] : "";

// Hàm format ngày UI -> BE (ISO string)
const toISOStringDate = (date: string) =>
  date ? new Date(date).toISOString() : "";

const BookingRoomUpdate = () => {
  const { roomBookingUpdate, roomDetailBookingUpdate } = useSelector(
    (state: RootState) => state.RoomReducer
  );

  const navigate = useNavigate();
  const dispatch: DispatchType = useDispatch();
  const { id } = useParams();

  const frmUpdateBooking = useFormik<
    Omit<BookingRoomType, "maPhong" | "maNguoiDung">
  >({
    enableReinitialize: true,
    initialValues: {
      ngayDen: formatDate(roomBookingUpdate?.ngayDen),
      ngayDi: formatDate(roomBookingUpdate?.ngayDi),
      soLuongKhach: roomBookingUpdate?.soLuongKhach || 1,
      id: roomBookingUpdate?.id || 0,
    },

    validationSchema: Yup.object({
      ngayDen: Yup.string()
        .required("Vui lòng chọn ngày check-in")
        .test("not-in-past", "Ngày check-in không được ở quá khứ", (value) => {
          if (!value) return true;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return new Date(value) >= today;
        }),
      ngayDi: Yup.string()
        .required("Vui lòng chọn ngày check-out")
        .test(
          "is-after-start",
          "Ngày check-out phải sau hoặc bằng ngày check-in",
          function (value) {
            const { ngayDen } = this.parent;
            if (!ngayDen || !value) return true; // chưa nhập đủ thì bỏ qua
            return new Date(value) >= new Date(ngayDen);
          }
        ),
      soLuongKhach: Yup.number()
        .min(1, "Số khách tối thiểu là 1")
        .max(
          roomDetailBookingUpdate?.khach || 20,
          "Vượt quá số khách tối đa của phòng"
        )
        .required("Vui lòng nhập số khách"),
    }),

    onSubmit: async (values) => {
      const payload: BookingRoomType = {
        ...values,
        ngayDen: toISOStringDate(values.ngayDen),
        ngayDi: toISOStringDate(values.ngayDi),
        maNguoiDung: roomBookingUpdate?.maNguoiDung ?? 0,
        maPhong: roomDetailBookingUpdate?.id ?? 0,
      };

      try {
        await UpdateRoomBooking(payload);
        dispatch(
          showAlert({
            type: "success",
            message: "Cập nhật thông tin đặt phòng",
            description: "Thành công",
          })
        );
        navigate(`/user/${roomBookingUpdate?.maNguoiDung}`);
      } catch (err: any) {
        dispatch(
          showAlert({
            type: "error",
            message: "Cập nhật thông tin đặt phòng",
            description: "Thất bại",
          })
        );
      }
    },
  });

  // Lấy dữ liệu booking theo id
  useEffect(() => {
    if (id) dispatch(getRoomBookingUpdateActionThunk(id));
  }, [id]);

  // Khi roomBookingUpdate thay đổi, mới gọi detail của room
  useEffect(() => {
    if (roomBookingUpdate?.maPhong) {
      dispatch(getRoomDetailBookingActionThunk(roomBookingUpdate.maPhong));
    }
  }, [roomBookingUpdate]);

  // Tính số đêm & tổng tiền
  const { nights, totalPrice } = useMemo(() => {
    let nights = 0;
    let totalPrice = 0;
    if (frmUpdateBooking.values.ngayDen && frmUpdateBooking.values.ngayDi) {
      const start = new Date(frmUpdateBooking.values.ngayDen);
      const end = new Date(frmUpdateBooking.values.ngayDi);
      nights = Math.max(
        0,
        Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24))
      );
      totalPrice = nights * (roomDetailBookingUpdate?.giaTien || 0);
    }
    return { nights, totalPrice };
  }, [frmUpdateBooking.values, roomDetailBookingUpdate]);
  return (
    <div className="pb-15">
      {/* Hình ảnh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 pt-10">
        <img
          src={roomDetailBookingUpdate?.hinhAnh || "https://i.pravatar.cc/200"}
          alt={roomDetailBookingUpdate?.tenPhong}
          className="w-full h-96 object-cover rounded-2xl shadow"
        />
        {/* Ảnh phụ hoặc giữ nguyên một ảnh */}
        <div className="grid grid-cols-2 gap-2">
          <img
            src={roomDetailBookingUpdate?.hinhAnh}
            className="rounded-lg object-cover h-48"
          />
          <img
            src={roomDetailBookingUpdate?.hinhAnh}
            className="rounded-lg object-cover h-48"
          />
          <img
            src={roomDetailBookingUpdate?.hinhAnh}
            className="rounded-lg object-cover h-48"
          />
          <img
            src={roomDetailBookingUpdate?.hinhAnh}
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
            <h1 className="text-3xl font-bold">
              {roomDetailBookingUpdate?.tenPhong}
            </h1>
            <p className="text-gray-600">
              {roomDetailBookingUpdate?.khach} khách ·{" "}
              {roomDetailBookingUpdate?.phongNgu} phòng ngủ ·{" "}
              {roomDetailBookingUpdate?.giuong} giường ·{" "}
              {roomDetailBookingUpdate?.phongTam} phòng tắm
            </p>
          </div>

          {/* Tiện nghi */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Tiện nghi</h2>
            <ul className="grid grid-cols-2 gap-3 text-gray-700">
              {roomDetailBookingUpdate?.mayGiat && <li>🧺 Máy giặt</li>}
              {roomDetailBookingUpdate?.banLa && <li>🧴 Bàn là</li>}
              {roomDetailBookingUpdate?.tivi && <li>📺 Tivi</li>}
              {roomDetailBookingUpdate?.dieuHoa && <li>❄️ Điều hòa</li>}
              {roomDetailBookingUpdate?.wifi && <li>📶 Wifi</li>}
              {roomDetailBookingUpdate?.bep && <li>🍳 Bếp</li>}
              {roomDetailBookingUpdate?.doXe && <li>🚗 Chỗ đỗ xe</li>}
              {roomDetailBookingUpdate?.hoBoi && <li>🏊 Hồ bơi</li>}
              {roomDetailBookingUpdate?.banUi && <li>🪞 Bàn ủi</li>}
            </ul>
          </div>

          {/* Mô tả */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
            <p className="text-gray-700 leading-relaxed">
              {roomDetailBookingUpdate?.moTa}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-24 h-fit space-y-6">
          {/* Giá phòng */}
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">
                {roomDetailBookingUpdate?.giaTien?.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-gray-500 text-lg">/ đêm</span>
            </div>
          </div>

          {/* Form Update */}
          <form onSubmit={frmUpdateBooking.handleSubmit} className="space-y-5">
            {/* Check-in */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Check-in
              </label>
              <input
                type="date"
                name="ngayDen"
                className={`w-full border rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                  frmUpdateBooking.errors.ngayDen &&
                  frmUpdateBooking.touched.ngayDen
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={frmUpdateBooking.values.ngayDen}
                onChange={frmUpdateBooking.handleChange}
                onBlur={frmUpdateBooking.handleBlur}
              />
              {frmUpdateBooking.errors.ngayDen &&
                frmUpdateBooking.touched.ngayDen && (
                  <p className="text-red-500 text-sm mt-1">
                    {frmUpdateBooking.errors.ngayDen}
                  </p>
                )}
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Check-out
              </label>
              <input
                type="date"
                name="ngayDi"
                className={`w-full border rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                  frmUpdateBooking.errors.ngayDi &&
                  frmUpdateBooking.touched.ngayDi
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={frmUpdateBooking.values.ngayDi}
                onChange={frmUpdateBooking.handleChange}
                onBlur={frmUpdateBooking.handleBlur}
              />
              {frmUpdateBooking.errors.ngayDi &&
                frmUpdateBooking.touched.ngayDi && (
                  <p className="text-red-500 text-sm mt-1">
                    {frmUpdateBooking.errors.ngayDi}
                  </p>
                )}
            </div>

            {/* Số khách */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Số khách
              </label>
              <input
                type="number"
                name="soLuongKhach"
                min="1"
                className={`w-full border rounded-xl px-3 py-2 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${
                  frmUpdateBooking.errors.soLuongKhach &&
                  frmUpdateBooking.touched.soLuongKhach
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                value={frmUpdateBooking.values.soLuongKhach}
                onChange={frmUpdateBooking.handleChange}
                onBlur={frmUpdateBooking.handleBlur}
              />
              {frmUpdateBooking.errors.soLuongKhach &&
                frmUpdateBooking.touched.soLuongKhach && (
                  <p className="text-red-500 text-sm mt-1">
                    {frmUpdateBooking.errors.soLuongKhach}
                  </p>
                )}
            </div>

            {/* Tổng tiền */}
            {frmUpdateBooking.values.ngayDen &&
              frmUpdateBooking.values.ngayDi &&
              nights > 0 && (
                <div className="p-3 bg-gray-50 rounded-xl text-gray-700">
                  <p>
                    {nights} đêm x{" "}
                    {roomDetailBookingUpdate?.giaTien?.toLocaleString("vi-VN")}₫
                    ={" "}
                    <span className="font-semibold text-lg">
                      {totalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  </p>
                </div>
              )}

            {/* Nút cập nhật */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-medium text-lg shadow-md transition"
            >
              ✅ Cập nhật đặt phòng
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingRoomUpdate;
