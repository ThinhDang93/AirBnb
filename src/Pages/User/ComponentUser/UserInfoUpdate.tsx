import { useFormik } from "formik";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import type { UserInfo } from "../../../assets/Models/User";
import { useEffect, useState } from "react";
import { httpClient } from "../../../Utils/interceptor";
import { UpdateUserAPI } from "../../../API/UserAPI";
import { UpdateAvatarActionThunk } from "../../../redux/reducers/UserReducer";
import { useDispatch, useSelector } from "react-redux";
import type { DispatchType, RootState } from "../../../redux/store";

const UserInfoUpdate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch: DispatchType = useDispatch();

  const { userDetailbyID } = useSelector(
    (state: RootState) => state.UserReducer
  );

  const [user, setUser] = useState<UserInfo | null>(null);

  // Lấy thông tin user
  const getUserDetailAPI = async (id: string | undefined) => {
    if (!id) return;
    const res = await httpClient.get(`/api/users/${id}`);
    setUser(res.data.content);
  };

  const UpdateAvatarAPI = (data: FormData) => {
    const actionThunk = UpdateAvatarActionThunk(data);
    dispatch(actionThunk);
  };

  useEffect(() => {
    getUserDetailAPI(id);
  }, [userDetailbyID]);

  // Formik config
  const frmEditUser = useFormik<UserInfo>({
    enableReinitialize: true,
    initialValues: user || {
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: true,
      role: "",
      id: -1,
      avatar: "",
    },
    onSubmit: async (values) => {
      if (!id) return;
      await UpdateUserAPI(values, id);
      alert("Cập nhật thông tin thành công");
      navigate(`/user/${id}`);
    },
  });

  return (
    <form onSubmit={frmEditUser.handleSubmit}>
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-5xl mx-auto flex gap-10 items-start pt-20">
        {/* Avatar */}
        <div className="flex flex-col items-center w-1/3 relative">
          <div className="relative group w-48 h-48 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg cursor-pointer">
            <img
              src={user?.avatar || "/default-avatar.png"}
              alt="Avatar"
              className="w-full h-full object-cover rounded-full border-4 border-blue-200 shadow-lg"
            />

            {/* Overlay hover */}
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-base rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              Thay đổi avatar
            </label>

            {/* Input upload file */}
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const previewURL = URL.createObjectURL(file);
                frmEditUser.setFieldValue("avatar", previewURL);

                try {
                  const formData = new FormData();
                  formData.append("formFile", file);

                  UpdateAvatarAPI(formData);
                } catch (err) {
                  console.error("Lỗi upload avatar:", err);
                }
              }}
            />
          </div>
        </div>
        {/* Thông tin user */}
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-y-6 gap-x-10">
            {/* Name */}
            <div className="text-gray-700 flex flex-col">
              <label className="font-semibold mb-1">👤 Name</label>
              <input
                type="text"
                name="name"
                value={frmEditUser.values.name}
                onChange={frmEditUser.handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Email */}
            <div className="text-gray-700 flex flex-col">
              <label className="font-semibold mb-1">📧 Email</label>
              <input
                type="email"
                name="email"
                value={frmEditUser.values.email}
                onChange={frmEditUser.handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Phone */}
            <div className="text-gray-700 flex flex-col">
              <label className="font-semibold mb-1">📱 Phone</label>
              <input
                type="text"
                name="phone"
                value={frmEditUser.values.phone}
                onChange={frmEditUser.handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Birthday */}
            <div className="text-gray-700 flex flex-col">
              <label className="font-semibold mb-1">🎂 Birthday</label>
              <input
                type="date"
                name="birthday"
                value={frmEditUser.values.birthday}
                onChange={frmEditUser.handleChange}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            {/* Gender */}
            <div className="text-gray-700 flex flex-col">
              <label className="font-semibold mb-1">⚧ Gender</label>
              <select
                name="gender"
                value={frmEditUser.values.gender ? "true" : "false"}
                onChange={(e) =>
                  frmEditUser.setFieldValue("gender", e.target.value === "true")
                }
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="true">Male</option>
                <option value="false">Female</option>
              </select>
            </div>

            {/* Role */}
            <div className="text-gray-700 flex flex-col">
              <label className="font-semibold mb-1">👤 Role</label>
              <p className="pt-2"> {frmEditUser.values.role}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex gap-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition shadow-md"
            >
              💾 Lưu thay đổi
            </button>
            <NavLink
              to={`/user/${id}`}
              className="bg-gray-200 px-8 py-3 rounded-lg hover:bg-gray-300 transition shadow-md"
            >
              ❌ Hủy
            </NavLink>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserInfoUpdate;
