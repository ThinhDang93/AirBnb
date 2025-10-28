import { useFormik } from "formik";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import type { LocationType } from "../../../assets/Models/Location";
import { httpClient } from "../../../Utils/interceptor";
import { useEffect } from "react";
import { AddLocaById, UpdateLocaById } from "../../../API/LocationAPI";

const FormLocateManageMent = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();

  const match = useMatch(`/admin/locateedit/${id}`);
  const isEdit = !!match;

  const frmLoca = useFormik<LocationType>({
    enableReinitialize: true,
    initialValues: {
      id: -1,
      tenViTri: "",
      tinhThanh: "",
      quocGia: "",
      hinhAnh: "",
    },
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await UpdateLocaById(values, id as any);
          alert("✅ Cập nhật vị trí thành công!");
        } else {
          await AddLocaById(values);
          alert("✅ Thêm vị trí thành công!");
        }
        navigate("/admin/locate");
      } catch (error) {
        alert("❌ Có lỗi xảy ra, vui lòng thử lại.");
      }
    },
  });

  const getLocaDetail = async () => {
    const res = await httpClient.get(`/api/vi-tri/${id}`);
    const data = res.data.content;
    frmLoca.setValues(data);
  };

  useEffect(() => {
    if (isEdit && id) {
      getLocaDetail();
    }
  }, [isEdit, id]);

  return (
    <div className="transition-all duration-300 lg:ml-64 min-h-screen ">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          {isEdit ? "Cập nhật vị trí" : "Thêm vị trí mới"}
        </h2>

        <form onSubmit={frmLoca.handleSubmit} className="space-y-5">
          {/* Tên vị trí */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tên vị trí
            </label>
            <input
              type="text"
              name="tenViTri"
              value={frmLoca.values.tenViTri}
              onChange={frmLoca.handleChange}
              placeholder="Nhập tên vị trí"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>

          {/* Tỉnh thành */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tỉnh thành
            </label>
            <input
              type="text"
              name="tinhThanh"
              value={frmLoca.values.tinhThanh}
              onChange={frmLoca.handleChange}
              placeholder="Nhập tỉnh thành"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>

          {/* Quốc gia */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Quốc gia
            </label>
            <input
              type="text"
              name="quocGia"
              value={frmLoca.values.quocGia}
              onChange={frmLoca.handleChange}
              placeholder="Nhập quốc gia"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-400"
            />
          </div>

          {/* Hình ảnh */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Link hình ảnh
            </label>
            <input
              type="text"
              name="hinhAnh"
              value={frmLoca.values.hinhAnh}
              onChange={frmLoca.handleChange}
              placeholder="Dán link hình ảnh vào đây"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200 focus:border-indigo-400"
            />

            {frmLoca.values.hinhAnh && (
              <div className="mt-4">
                <img
                  src={frmLoca.values.hinhAnh}
                  alt="Preview"
                  className="rounded-lg w-48 h-32 object-cover shadow-md border"
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/locate")}
              className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
            >
              Quay lại
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormLocateManageMent;
