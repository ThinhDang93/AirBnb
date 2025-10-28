import { Link } from "react-router-dom";
import { FaTools } from "react-icons/fa";
import { Helmet } from "react-helmet-async";

const ComingSoon = () => {
  return (
    <>
      <Helmet>
        <title>Đang được cập nhật | AirBnB Clone</title>
        <meta
          name="description"
          content="Đặt phòng du lịch, homestay, villa, khách sạn giá tốt nhất."
        />
      </Helmet>

      <div className="flex flex-col items-center justify-center min-h-screen  px-4">
        <FaTools className="text-blue-500 text-6xl mb-4 animate-bounce" />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🚧 Coming Soon 🚧
        </h1>
        <p className="text-gray-600 text-center max-w-md mb-6">
          Tính năng này hiện đang được phát triển. Vui lòng quay lại sau!
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

export default ComingSoon;
