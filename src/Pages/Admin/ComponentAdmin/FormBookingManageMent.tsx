import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { DispatchType, RootState } from "../../../redux/store";
import {
  getUserDetailbyIDActionThunk,
  SetUserDetailNullActionThunk,
} from "../../../redux/reducers/UserReducer";
import { getAllLocaActionThunk } from "../../../redux/reducers/LocationReducer";
import { UpdateRoomBooking } from "../../../API/RoomAPI";
import type { BookingRoomType } from "../../../assets/Models/Room";
import { getRoomDetailActionThunk } from "../../../redux/reducers/RoomReducer";
import { showAlert } from "../../../redux/reducers/AlertReducer";

const FormBookingManageMent = () => {
  const params = useParams();
  const { id, maNguoiDung, maPhong } = params;
  const dispatch: DispatchType = useDispatch();
  const navigate = useNavigate();

  // Lấy danh sách từ Redux
  const { arrAllBookingRoom } = useSelector(
    (state: RootState) => state.BookingReducer
  );
  const { roomDetail } = useSelector((state: RootState) => state.RoomReducer);
  const { arrAllLocation } = useSelector(
    (state: RootState) => state.LocationReducer
  );
  const { userDetailbyID } = useSelector(
    (state: RootState) => state.UserReducer
  );

  // Tìm booking theo id
  const booking = arrAllBookingRoom.find((b) => b.id === Number(id));

  const getUserDetailAPI = (maNguoiDung: any) => {
    const action = getUserDetailbyIDActionThunk(maNguoiDung);
    dispatch(action);
  };

  const getAllLocaAPI = () => {
    const action = getAllLocaActionThunk();
    dispatch(action);
  };

  const getRoomDetailAPI = (maPhong: any) => {
    const action = getRoomDetailActionThunk(maPhong);
    dispatch(action);
  };

  useEffect(() => {
    getAllLocaAPI();
  }, []);

  useEffect(() => {
    if (maNguoiDung) {
      dispatch(SetUserDetailNullActionThunk());
      getUserDetailAPI(maNguoiDung);
    }
  }, [maNguoiDung]);

  useEffect(() => {
    if (maPhong) getRoomDetailAPI(maPhong);
  }, [maPhong]);

  if (!booking) {
    return (
      <div className="transition-all duration-300 lg:ml-64">
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Không tìm thấy thông tin đặt phòng
          </h2>
        </div>
      </div>
    );
  }

  // Map sang room & location tương ứng
  const viTri = roomDetail
    ? arrAllLocation.find((v) => v.id === roomDetail.maViTri)
    : undefined;

  // 🧾 Formik
  const frmBooking = useFormik<BookingRoomType>({
    enableReinitialize: true,
    initialValues: {
      id: booking.id,
      ngayDen: booking.ngayDen.split("T")[0],
      ngayDi: booking.ngayDi.split("T")[0],
      soLuongKhach: booking.soLuongKhach,
      maPhong: booking.maPhong,
      maNguoiDung: booking.maNguoiDung,
    },
    validationSchema: Yup.object({
      ngayDen: Yup.string().required("Vui lòng chọn ngày đến"),
      ngayDi: Yup.string()
        .required("Vui lòng chọn ngày đi")
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
        .required("Nhập số lượng khách")
        .min(1, "Số khách phải ≥ 1")
        .max(roomDetail?.khach ?? 1, `Tối đa ${roomDetail?.khach ?? 1} khách`),
    }),
    onSubmit: async (values) => {
      try {
        await UpdateRoomBooking(values);
        navigate("/admin/booking");
        dispatch(
          showAlert({
            type: "success",
            message: "Cập nhật thông tin đặt phòng",
            description: "Thành công",
          })
        );
      } catch (error: any) {
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

  // 🧮 Tính số đêm
  const nights = useMemo(() => {
    const { ngayDen, ngayDi } = frmBooking.values;
    if (!ngayDen || !ngayDi) return 0;
    const diff =
      (new Date(ngayDi).getTime() - new Date(ngayDen).getTime()) /
      (1000 * 60 * 60 * 24);
    return diff > 0 ? Math.ceil(diff) : 1;
  }, [frmBooking.values.ngayDen, frmBooking.values.ngayDi]);

  // 💰 Tính tổng tiền
  const totalPrice = (roomDetail?.giaTien ?? 0) * nights;

  return (
    <div className="p-6 sm:ml-64 min-h-screen ">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Chi tiết đặt phòng{" "}
            <span className="text-indigo-600">#{booking.id}</span>
          </h2>
          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium">
            Đang xử lý
          </span>
        </div>

        {/* Grid layout */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Phòng */}
          <div className="flex flex-col space-y-5 h-full">
            <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
              🏠 Thông tin phòng
            </h3>

            {roomDetail ? (
              <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 flex flex-col h-full">
                <img
                  src={roomDetail.hinhAnh}
                  alt={roomDetail.tenPhong}
                  className="w-full h-56 object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-gray-800 text-lg font-semibold">
                      {roomDetail.tenPhong}
                    </p>
                    <p className="text-gray-500 text-sm">
                      <span className="font-medium text-gray-700">
                        Giá tiền:
                      </span>{" "}
                      {roomDetail.giaTien?.toLocaleString()} VND / đêm
                    </p>

                    {viTri ? (
                      <p className="text-gray-500 text-sm">
                        <span className="font-medium text-gray-700">
                          Địa điểm:
                        </span>{" "}
                        {viTri.tenViTri} - {viTri.tinhThanh}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic text-sm">
                        Không tìm thấy thông tin vị trí
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t mt-3 text-sm text-gray-500">
                    <p>
                      <i className="fa-solid fa-bed text-indigo-500 mr-1"></i>{" "}
                      {roomDetail.khach} khách • {roomDetail.phongNgu} phòng ngủ
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Không tìm thấy thông tin phòng
              </p>
            )}
          </div>

          {/* Người dùng */}
          <div className="flex flex-col space-y-5 h-full">
            <h3 className="text-lg font-semibold text-indigo-600 flex items-center gap-2">
              👤 Thông tin người đặt
            </h3>

            {userDetailbyID ? (
              <div className="rounded-xl border border-gray-100 p-6 shadow-md bg-gradient-to-b from-white to-gray-50 flex flex-col justify-between h-full">
                {/* Avatar + Tên */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    {userDetailbyID.avatar ? (
                      <img
                        src={userDetailbyID.avatar}
                        alt={userDetailbyID.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                      />
                    ) : (
                      <img
                        src={"https://i.pravatar.cc/80"}
                        alt={userDetailbyID.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                      />
                    )}
                    <span className="absolute bottom-1 right-1 bg-green-400 w-4 h-4 rounded-full border-2 border-white"></span>
                  </div>

                  <div>
                    <h4 className="text-2xl font-semibold text-gray-800">
                      {userDetailbyID.name}
                    </h4>
                    <p className="text-gray-500 text-sm mt-1 capitalize">
                      Vai trò:{" "}
                      <span className="text-indigo-600 font-medium">
                        {userDetailbyID.role}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="space-y-4 text-gray-700 text-sm flex-1">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-envelope text-indigo-500 w-5"></i>
                      <span className="font-medium text-gray-800">Email:</span>
                    </div>
                    <p className="text-gray-600">
                      {userDetailbyID.email || "—"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-phone text-indigo-500 w-5"></i>
                      <span className="font-medium text-gray-800">
                        Số điện thoại:
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {userDetailbyID.phone || "—"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-cake-candles text-indigo-500 w-5"></i>
                      <span className="font-medium text-gray-800">
                        Ngày sinh:
                      </span>
                    </div>
                    <p className="text-gray-600">{userDetailbyID?.birthday}</p>
                  </div>

                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-venus-mars text-indigo-500 w-5"></i>
                      <span className="font-medium text-gray-800">
                        Giới tính:
                      </span>
                    </div>
                    <p className="text-gray-600">
                      {userDetailbyID.gender ? "Nam" : "Nữ"}
                    </p>
                  </div>
                </div>

                {/* Nút điều hướng */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/user/${userDetailbyID.id}`)}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-200 transition"
                  >
                    Xem hồ sơ người dùng
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Không tìm thấy thông tin người dùng
              </p>
            )}
          </div>
        </div>

        {/* Chi tiết đặt phòng */}
        <div className="mt-10 pt-6 border-t">
          <h3 className="text-lg font-semibold text-indigo-600 mb-4">
            📅 Thông tin đặt phòng
          </h3>

          {/* 🧾 Form chỉnh sửa */}
          <form
            onSubmit={frmBooking.handleSubmit}
            className="grid md:grid-cols-4 gap-6 text-gray-700"
          >
            <div>
              <label className="font-medium text-gray-800 block mb-1">
                Ngày đến
              </label>
              <input
                type="date"
                name="ngayDen"
                value={frmBooking.values.ngayDen}
                onChange={frmBooking.handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
              {frmBooking.errors.ngayDen && (
                <p className="text-red-500 text-sm">
                  {frmBooking.errors.ngayDen}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium text-gray-800 block mb-1">
                Ngày đi
              </label>
              <input
                type="date"
                name="ngayDi"
                value={frmBooking.values.ngayDi}
                onChange={frmBooking.handleChange}
                className="border rounded-lg px-3 py-2 w-full"
              />
              {frmBooking.errors.ngayDi && (
                <p className="text-red-500 text-sm">
                  {frmBooking.errors.ngayDi}
                </p>
              )}
            </div>

            <div>
              <label className="font-medium text-gray-800 block mb-1">
                Số lượng khách
              </label>
              <input
                type="number"
                name="soLuongKhach"
                value={frmBooking.values.soLuongKhach}
                onChange={frmBooking.handleChange}
                min={1}
                className="border rounded-lg px-3 py-2 w-full"
              />
              {frmBooking.errors.soLuongKhach && (
                <p className="text-red-500 text-sm">
                  {frmBooking.errors.soLuongKhach}
                </p>
              )}
            </div>

            <div>
              <p className="font-medium text-gray-800">Tổng tiền</p>
              <p className="text-indigo-600 font-semibold text-lg mt-2">
                {totalPrice.toLocaleString()} VND
              </p>
              <p className="text-sm text-gray-500">
                ({nights} đêm × {roomDetail?.giaTien?.toLocaleString()}₫)
              </p>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Cập nhật đặt phòng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormBookingManageMent;
