import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const Page404 = () => {
  return (
    <>
      <Helmet>
        <title>Lỗi ❌ | AirBnB Clone</title>
        <meta
          name="description"
          content="Đặt phòng du lịch, homestay, villa, khách sạn giá tốt nhất."
        />
      </Helmet>
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <FaExclamationTriangle className="text-yellow-500 text-6xl mb-4" />
        <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Trang không tồn tại ❌
        </h2>
        <p className="text-gray-500 text-center max-w-md mb-6">
          Xin lỗi! Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>

        <Link
          to="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          ⬅️ Quay về Trang Chủ
        </Link>
      </div>
    </>
  );
};

export default Page404;
