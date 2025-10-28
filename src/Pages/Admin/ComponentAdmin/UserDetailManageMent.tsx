import { useFormik } from "formik";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import type { UserInfo } from "../../../assets/Models/User";
import { useEffect } from "react";
import { httpClient } from "../../../Utils/interceptor";
import { PostNewUserAPI, UpdateUserAPI } from "../../../API/UserAPI";
import * as Yup from "yup";


const UserDetailManageMent = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { id } = params;
  const match = useMatch(`/admin/user/${id}`);
  const isEdit = !!match;

  const frmEditUser = useFormik<UserInfo>({
    enableReinitialize: true,
    initialValues: {
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
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập họ tên"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      // password: bắt buộc khi thêm mới; khi edit -> không bắt buộc nhưng nếu nhập vẫn phải >=6
      password: isEdit
        ? Yup.string().min(6, "Mật khẩu tối thiểu 6 ký tự")
        : Yup.string()
            .min(6, "Mật khẩu tối thiểu 6 ký tự")
            .required("Vui lòng nhập mật khẩu"),
      phone: Yup.string()
        .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
        .required("Vui lòng nhập số điện thoại"),
      birthday: Yup.string().required("Vui lòng nhập ngày sinh"),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        birthday: (values.birthday),
      };
      try {
        if (isEdit) {
          await UpdateUserAPI(payload, id);
          alert("Cập nhật thông tin thành công");
        } else {
          await PostNewUserAPI(payload);
          alert("Thêm mới người dùng thành công");
        }
        navigate("/admin");
      } catch (err: any) {
        console.error(err);
        alert(err?.response?.data?.message || "Có lỗi xảy ra");
      }
    },
  });

  const GetUserDetailAPI = async (userId: any) => {
    const res = await httpClient.get(`/api/users/${userId}`, userId);
    const data = res.data.content;
    frmEditUser.setValues({
      name: data.name ?? "",
      email: data.email ?? "",
      password: "", // NEVER populate password from server
      phone: data.phone ?? "",
      birthday: (data.birthday),
      gender: data.gender ?? true,
      role: data.role ?? "",
      id: data.id ?? -1,
      avatar: data.avatar ?? "",
    });
  };

  useEffect(() => {
    if (isEdit && id) {
      GetUserDetailAPI(id);
    }
  }, [id, isEdit]);

  return (
    <div className="p-5 sm:ml-64 pt-20">
      <form
        onSubmit={frmEditUser.handleSubmit}
        className="space-y-6 max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-lg"
      >
        <h4 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          {isEdit ? "✏️ Cập nhật người dùng" : "➕ Thêm mới người dùng"}
        </h4>

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
            onBlur={frmEditUser.handleBlur}
            className={`border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${
              frmEditUser.errors.name && frmEditUser.touched.name
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter full name"
          />
          {frmEditUser.errors.name && frmEditUser.touched.name && (
            <p className="text-red-500 text-sm mt-1">
              {frmEditUser.errors.name}
            </p>
          )}
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
            onBlur={frmEditUser.handleBlur}
            className={`border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${
              frmEditUser.errors.email && frmEditUser.touched.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter email"
          />
          {frmEditUser.errors.email && frmEditUser.touched.email && (
            <p className="text-red-500 text-sm mt-1">
              {frmEditUser.errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={frmEditUser.values.password}
            onChange={frmEditUser.handleChange}
            onBlur={frmEditUser.handleBlur}
            className={`border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${
              frmEditUser.errors.password && frmEditUser.touched.password
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder={
              isEdit ? "Để trống nếu không muốn đổi mật khẩu" : "Enter password"
            }
          />
          {frmEditUser.errors.password && frmEditUser.touched.password && (
            <p className="text-red-500 text-sm mt-1">
              {frmEditUser.errors.password}
            </p>
          )}
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
            onBlur={frmEditUser.handleBlur}
            className={`border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${
              frmEditUser.errors.phone && frmEditUser.touched.phone
                ? "border-red-500"
                : "border-gray-300"
            }`}
            placeholder="Enter phone number"
          />
          {frmEditUser.errors.phone && frmEditUser.touched.phone && (
            <p className="text-red-500 text-sm mt-1">
              {frmEditUser.errors.phone}
            </p>
          )}
        </div>

        {/* Birthday */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Birthday
          </label>
          <input
            type="date"
            name="birthday"
            value={frmEditUser.values.birthday || ""}
            onChange={(e) =>
              frmEditUser.setFieldValue("birthday", e.target.value)
            }
            onBlur={frmEditUser.handleBlur}
            className={`border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${
              frmEditUser.errors.birthday && frmEditUser.touched.birthday
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {frmEditUser.errors.birthday && frmEditUser.touched.birthday && (
            <p className="text-red-500 text-sm mt-1">
              {frmEditUser.errors.birthday}
            </p>
          )}
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
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400"
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
            onBlur={frmEditUser.handleBlur}
            className={`border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-400 ${
              frmEditUser.errors.role && frmEditUser.touched.role
                ? "border-red-500"
                : "border-gray-300"
            }`}
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
            {isEdit ? "Update" : "Add new"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserDetailManageMent;
