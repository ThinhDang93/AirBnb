import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import type { RootState, DispatchType } from "../../../redux/store";
import type { BookingRoomType } from "../../../assets/Models/Room";
import * as Yup from "yup";
import { postInfoBookingRoomActionThunk } from "../../../redux/reducers/RoomReducer";
import { showAlert } from "../../../redux/reducers/AlertReducer";

const RoomBooking = () => {
  const { roomDetail } = useSelector((state: RootState) => state.RoomReducer);
  const { userInfoLogin } = useSelector(
    (state: RootState) => state.UserReducer
  ); // lấy thông tin user từ store

  const dispatch: DispatchType = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  // Formik chỉ quản lý dữ liệu user nhập (ngày & số khách)
  const frmBookingRoom = useFormik<
    Omit<BookingRoomType, "maPhong" | "maNguoiDung">
  >({
    initialValues: {
      id: -1,
      ngayDen: "",
      ngayDi: "",
      soLuongKhach: 1,
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
        .min(1, "Số khách phải ≥ 1")
        .max(roomDetail?.khach ?? 1, `Tối đa ${roomDetail?.khach ?? 1} khách`),
    }),
    onSubmit: async (values) => {
      if (!userInfoLogin) {
        dispatch(
          showAlert({
            type: "warning",
            message: "Bạn chưa đăng nhập",
            description: "Vui lòng đăng nhập để đặt phòng.",
          })
        );
        navigate(`/login?redirectTo=/detail/${id}`);
        return;
      }

      const payload: BookingRoomType = {
        ...values,
        maPhong: Number(id),
        maNguoiDung: userInfoLogin?.id ?? 0, // lấy id từ store Redux
      };

      try {
        dispatch(postInfoBookingRoomActionThunk(payload));
        navigate("/"); //
        dispatch(
          showAlert({
            type: "success",
            message: "Đặt phòng thành công",
            description: "",
          })
        );
      } catch (err: any) {
        dispatch(
          showAlert({
            type: "error",
            message: "Đặt phòng thất bại",
            description: "Vui lòng kiểm tra lại thông tin.",
          })
        );
      }
    },
  });

  const nights =
    frmBookingRoom.values.ngayDen && frmBookingRoom.values.ngayDi
      ? Math.max(
          1,
          Math.ceil(
            (new Date(frmBookingRoom.values.ngayDi).getTime() -
              new Date(frmBookingRoom.values.ngayDen).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
  const totalPrice = (roomDetail?.giaTien ?? 0) * nights;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-24 h-fit space-y-4">
      {/* Giá phòng */}
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold text-gray-900">
          {roomDetail?.giaTien.toLocaleString("vi-VN")}₫
        </span>
        <span className="text-gray-500">/ đêm</span>
      </div>

      {/* Chọn ngày */}
      <form onSubmit={frmBookingRoom.handleSubmit} className="space-y-3">
        <div>
          <label className="block text-gray-700 mb-1">Check-in</label>
          <input
            type="date"
            name="ngayDen"
            id="ngayDen"
            className={`w-full border rounded-lg px-3 py-2 ${
              frmBookingRoom.errors.ngayDen && frmBookingRoom.touched.ngayDen
                ? "border-red-500"
                : ""
            }`}
            value={frmBookingRoom.values.ngayDen}
            onChange={(e) =>
              frmBookingRoom.setFieldValue("ngayDen", e.target.value)
            }
            onBlur={frmBookingRoom.handleBlur}
          />
          {frmBookingRoom.errors.ngayDen && frmBookingRoom.touched.ngayDen && (
            <p className="text-red-500 text-sm mt-1">
              {frmBookingRoom.errors.ngayDen}
            </p>
          )}
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Check-out</label>
          <input
            type="date"
            name="ngayDi"
            id="ngayDi"
            className={`w-full border rounded-lg px-3 py-2 ${
              frmBookingRoom.errors.ngayDi && frmBookingRoom.touched.ngayDi
                ? "border-red-500"
                : ""
            }`}
            value={frmBookingRoom.values.ngayDi}
            onChange={(e) =>
              frmBookingRoom.setFieldValue("ngayDi", e.target.value)
            }
            onBlur={frmBookingRoom.handleBlur}
          />
          {frmBookingRoom.errors.ngayDi && frmBookingRoom.touched.ngayDi && (
            <p className="text-red-500 text-sm mt-1">
              {frmBookingRoom.errors.ngayDi}
            </p>
          )}
        </div>

        {/* Số khách */}
        <div>
          <label className="block text-gray-700 mb-1">Số khách</label>
          <input
            type="number"
            name="soLuongKhach"
            // min={1}
            // max={roomDetail?.khach}
            className={`w-full border rounded-lg px-3 py-2 ${
              frmBookingRoom.errors.soLuongKhach &&
              frmBookingRoom.touched.soLuongKhach
                ? "border-red-500"
                : ""
            }`}
            value={frmBookingRoom.values.soLuongKhach}
            onChange={frmBookingRoom.handleChange}
            onBlur={frmBookingRoom.handleBlur}
          />
          {frmBookingRoom.errors.soLuongKhach &&
            frmBookingRoom.touched.soLuongKhach && (
              <p className="text-red-500 text-sm mt-1">
                {frmBookingRoom.errors.soLuongKhach}
              </p>
            )}
        </div>

        {/* Tổng tiền */}
        {frmBookingRoom.values.ngayDen && frmBookingRoom.values.ngayDi && (
          <div className="text-gray-700">
            {nights} đêm x {roomDetail?.giaTien.toLocaleString("vi-VN")}₫ ={" "}
            <span className="font-semibold">
              {totalPrice.toLocaleString("vi-VN")}₫
            </span>
          </div>
        )}

        {/* Nút đặt phòng */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-lg shadow"
        >
          Đặt phòng
        </button>
      </form>
    </div>
  );
};

export default RoomBooking;
