import { HeaderComponent } from "../../Component/HeaderComponent";
import { Outlet } from "react-router-dom";
import FooterComponent from "../../Component/FooterComponent";

const HomeTemplate = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderComponent />
      <div className="container mx-auto w-full">
        <Outlet />
      </div>
      <FooterComponent />
    </div>
  );
};

export default HomeTemplate;
