import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useNavigate } from "react-router-dom";
import type { UserInfo } from "../../assets/Models/User";
import { postDataRegisterAPI } from "../../API/RegisterAPI";

const Register = () => {
  const navigate = useNavigate();

  const frmRegister = useFormik<UserInfo>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: true,
      role: "USER",
      id: -1,
      avatar: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Vui lòng nhập họ tên"),
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string()
        .min(6, "Mật khẩu tối thiểu 6 ký tự")
        .required("Vui lòng nhập mật khẩu"),
      phone: Yup.string()
        .matches(/^[0-9]+$/, "Số điện thoại chỉ được chứa số")
        .required("Vui lòng nhập số điện thoại"),
      birthday: Yup.string().required("Vui lòng nhập ngày sinh"),
      role: Yup.string().required("Vui lòng chọn vai trò"),
    }),
    onSubmit: async (values) => {
      try {
        postDataRegisterAPI(values);
        alert("Đăng ký thành công!");
        navigate("/login");
      } catch (err: any) {
        alert(err.response?.data?.message || "Đăng ký thất bại");
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-blue-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Đăng ký
        </h2>

        <form onSubmit={frmRegister.handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                frmRegister.touched.name && frmRegister.errors.name
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="Nguyễn Văn A"
              value={frmRegister.values.name}
              onChange={frmRegister.handleChange}
              onBlur={frmRegister.handleBlur}
            />
            {frmRegister.touched.name && frmRegister.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {frmRegister.errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                frmRegister.touched.email && frmRegister.errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="example@gmail.com"
              value={frmRegister.values.email}
              onChange={frmRegister.handleChange}
              onBlur={frmRegister.handleBlur}
            />
            {frmRegister.touched.email && frmRegister.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {frmRegister.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                frmRegister.touched.password && frmRegister.errors.password
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="********"
              value={frmRegister.values.password}
              onChange={frmRegister.handleChange}
              onBlur={frmRegister.handleBlur}
            />
            {frmRegister.touched.password && frmRegister.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {frmRegister.errors.password}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                frmRegister.touched.phone && frmRegister.errors.phone
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="0123456789"
              value={frmRegister.values.phone}
              onChange={frmRegister.handleChange}
              onBlur={frmRegister.handleBlur}
            />
            {frmRegister.touched.phone && frmRegister.errors.phone && (
              <p className="text-red-500 text-sm mt-1">
                {frmRegister.errors.phone}
              </p>
            )}
          </div>

          {/* Birthday */}
          <div>
            <label htmlFor="birthday" className="block text-gray-700 mb-1">
              Ngày sinh
            </label>
            <input
              id="birthday"
              name="birthday"
              type="date"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                frmRegister.touched.birthday && frmRegister.errors.birthday
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              value={frmRegister.values.birthday}
              onChange={frmRegister.handleChange}
              onBlur={frmRegister.handleBlur}
            />
            {frmRegister.touched.birthday && frmRegister.errors.birthday && (
              <p className="text-red-500 text-sm mt-1">
                {frmRegister.errors.birthday}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <span className="block text-gray-700 mb-1">Giới tính</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="true"
                  checked={frmRegister.values.gender === true}
                  onChange={() => frmRegister.setFieldValue("gender", true)}
                />
                Nam
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="false"
                  checked={frmRegister.values.gender === false}
                  onChange={() => frmRegister.setFieldValue("gender", false)}
                />
                Nữ
              </label>
            </div>
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-gray-700 mb-1">
              Vai trò
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={frmRegister.values.role}
              onChange={frmRegister.handleChange}
            >
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Quản trị</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={frmRegister.isSubmitting}
            className={`w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-medium transition duration-200 shadow ${
              frmRegister.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {frmRegister.isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-6">
          Đã có tài khoản?{" "}
          <NavLink
            to="/login"
            className="text-pink-600 hover:underline font-medium"
          >
            Đăng nhập ngay
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Register;
