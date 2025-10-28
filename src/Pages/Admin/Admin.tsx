import { Helmet } from "react-helmet-async";
import UserManageMent from "./ComponentAdmin/UserManageMent";

const Admin = () => {
  return (
    <>
      <Helmet>
        <title>Trang Quản trị | AirBnB Clone</title>
        <meta
          name="description"
          content="Đặt phòng du lịch, homestay, villa, khách sạn giá tốt nhất."
        />
      </Helmet>

      <div className="transition-all duration-300 lg:ml-64">
        <UserManageMent />
      </div>
    </>
  );
};

export default Admin;
