import { Outlet } from "react-router-dom";
import SlideBar from "../../Component/SlideBar";

const AdminTemplate = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <SlideBar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminTemplate;
