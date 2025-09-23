import { useFormik } from "formik";
import type { UserLogin } from "../../assets/Models/User";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEKN } from "../../Utils/interceptor";
import { useDispatch } from "react-redux";
import type { DispatchType } from "../../redux/store";
import { getUserInfoLoginActionThunk } from "../../redux/reducers/UserReducer";

const Login = () => {
  const navigate = useNavigate();

  const dispatch: DispatchType = useDispatch();
  const location: any = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectTo = queryParams.get("redirectTo");

  const frmLogin = useFormik<UserLogin>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        localStorage.removeItem(ACCESS_TOKEKN);
        dispatch(getUserInfoLoginActionThunk(values));
        navigate(redirectTo || "/"); // Điều hướng về trang Home
      } catch (err: any) {
        alert(err.response?.data?.message || "Đăng nhập thất bại");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
          Đăng nhập
        </h2>

        <form onSubmit={frmLogin.handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                frmLogin.touched.email && frmLogin.errors.email
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="Nhập email..."
              value={frmLogin.values.email}
              onChange={frmLogin.handleChange}
              onBlur={frmLogin.handleBlur}
            />
            {frmLogin.touched.email && frmLogin.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {frmLogin.errors.email}
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
              type="password"
              name="password"
              className={`w-full px-4 py-2 border rounded-xl focus:ring-2 focus:outline-none ${
                frmLogin.touched.password && frmLogin.errors.password
                  ? "border-red-400 focus:ring-red-300"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
              placeholder="Nhập mật khẩu..."
              value={frmLogin.values.password}
              onChange={frmLogin.handleChange}
              onBlur={frmLogin.handleBlur}
            />
            {frmLogin.touched.password && frmLogin.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {frmLogin.errors.password}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={frmLogin.isSubmitting}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition duration-200 shadow ${
              frmLogin.isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {frmLogin.isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Đăng ký */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Chưa có tài khoản?{" "}
          <NavLink
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng ký ngay
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default Login;
