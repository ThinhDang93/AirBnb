import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import type { UserInfo } from "../../../assets/Models/User";
import { useEffect, useState } from "react";
import { httpClient } from "../../../Utils/interceptor";
import { UpdateUserAPI } from "../../../API/UserAPI";

const UserDetailManageMent = () => {
  const params = useParams();

  const navigate = useNavigate();

  const { id } = params;

  const [user, setUser] = useState<UserInfo | null>(null);

  const GetUserDetailAPI = async (id: any) => {
    const res = await httpClient.get(`/api/users/${id}`, id);
    setUser(res.data.content);
  };

  useEffect(() => {
    GetUserDetailAPI(id);
  }, [id]);

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
      await UpdateUserAPI(values, id);
      alert("Cập nhật thông tin thành công");
      navigate("/admin");
    },
  });
  return (
    <div className="p-4 sm:ml-64 pt-20">
      <form
        onSubmit={frmEditUser.handleSubmit}
        className="space-y-6 max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg"
      >
        <h4 className="mx-auto"> Cập nhật thông tin </h4>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={frmEditUser.values.name}
            onChange={frmEditUser.handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={frmEditUser.values.email}
            onChange={frmEditUser.handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter email"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={frmEditUser.values.phone}
            onChange={frmEditUser.handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birthday
          </label>
          <input
            type="date"
            name="birthday"
            value={frmEditUser.values.birthday}
            onChange={frmEditUser.handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={frmEditUser.values.gender ? "true" : "false"}
            onChange={(e) =>
              frmEditUser.setFieldValue("gender", e.target.value === "true")
            }
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="true">Male</option>
            <option value="false">Female</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Role
          </label>
          <select
            name="role"
            value={frmEditUser.values.role}
            onChange={frmEditUser.handleChange}
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Select role</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailManageMent;
