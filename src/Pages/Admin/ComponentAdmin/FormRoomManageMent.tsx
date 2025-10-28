import { useFormik } from "formik";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import type { RoomDetailType } from "../../../assets/Models/Room";
import { AddRoomAPIbyID, UpdateRoomAPIbyID } from "../../../API/RoomAPI";
import { httpClient } from "../../../Utils/interceptor";
import { useEffect } from "react";

const FormRoomManageMent = () => {
  const navigate = useNavigate();
  const params = useParams();

  const { id } = params;

  const match = useMatch(`/admin/roomedit/${id}`);

  const isEdit = !!match;

  const frmRoom = useFormik<RoomDetailType>({
    enableReinitialize: true,
    initialValues: {
      id: 0,
      tenPhong: "",
      khach: 0,
      phongNgu: 0,
      giuong: 0,
      phongTam: 0,
      moTa: "",
      giaTien: 0,
      mayGiat: false,
      banLa: false,
      tivi: false,
      dieuHoa: false,
      wifi: false,
      bep: false,
      doXe: false,
      hoBoi: false,
      banUi: false,
      maViTri: 0,
      hinhAnh: "",
    },
    onSubmit: async (values) => {
      if (isEdit) {
        await UpdateRoomAPIbyID(id, values);
        alert("Update room thành công");
      } else {
        await AddRoomAPIbyID(values);
        alert("Add room thành công");
      }
      navigate("/admin/room");
    },
  });

  const getRoomDetail = async () => {
    const res = await httpClient.get(`/api/phong-thue/${id}`);
    const data = res.data.content;
    frmRoom.setValues(data);
  };

  useEffect(() => {
    if (isEdit && id) {
      getRoomDetail();
    }
  }, [isEdit, id]);
  return (
    <div className="transition-all duration-300 lg:ml-64">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-4">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          {isEdit ? "✏️ Edit Room" : "➕ Add New Room"}
        </h2>

        <form onSubmit={frmRoom.handleSubmit} className="space-y-6">
          {/* Tên phòng */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Tên phòng
            </label>
            <input
              type="text"
              name="tenPhong"
              value={frmRoom.values.tenPhong}
              onChange={frmRoom.handleChange}
              className="border w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Nhập tên phòng..."
            />
          </div>

          {/* Các thông tin số */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "khach", label: "Số khách" },
              { name: "phongNgu", label: "Phòng ngủ" },
              { name: "giuong", label: "Giường" },
              { name: "phongTam", label: "Phòng tắm" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block font-semibold text-gray-700 mb-1">
                  {field.label}
                </label>
                <input
                  type="number"
                  name={field.name}
                  value={(frmRoom.values as any)[field.name]}
                  onChange={frmRoom.handleChange}
                  className="border w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            ))}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              name="moTa"
              value={frmRoom.values.moTa}
              onChange={frmRoom.handleChange}
              rows={4}
              className="border w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Mô tả chi tiết phòng..."
            />
          </div>

          {/* Giá tiền */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Giá tiền
            </label>
            <input
              type="number"
              name="giaTien"
              value={frmRoom.values.giaTien}
              onChange={frmRoom.handleChange}
              className="border w-full px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="Nhập giá tiền..."
            />
          </div>

          {/* Tiện nghi */}
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              Tiện nghi
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-gray-700">
              {[
                { name: "mayGiat", label: "🧺 Máy giặt" },
                { name: "banLa", label: "🧴 Bàn là" },
                { name: "tivi", label: "📺 Tivi" },
                { name: "dieuHoa", label: "❄️ Điều hòa" },
                { name: "wifi", label: "📶 Wifi" },
                { name: "bep", label: "🍳 Bếp" },
                { name: "doXe", label: "🚗 Chỗ đỗ xe" },
                { name: "hoBoi", label: "🏊 Hồ bơi" },
                { name: "banUi", label: "🪞 Bàn ủi" },
              ].map((field) => (
                <li key={field.name}>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={(frmRoom.values as any)[field.name]}
                      onChange={frmRoom.handleChange}
                      className="h-5 w-5 text-blue-500"
                    />
                    <span>{field.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Mã vị trí + Hình ảnh */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Mã vị trí
              </label>
              <input
                type="number"
                name="maViTri"
                value={frmRoom.values.maViTri}
                onChange={frmRoom.handleChange}
                className="border w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Hình ảnh
              </label>
              <input
                type="text"
                name="hinhAnh"
                value={frmRoom.values.hinhAnh}
                onChange={frmRoom.handleChange}
                className="border w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="URL hình ảnh..."
              />
            </div>
          </div>

          {/* Nút submit */}
          <div className="pt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition"
            >
              {isEdit ? "💾 Cập nhật" : "✅ Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormRoomManageMent;
