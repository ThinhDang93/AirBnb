import React from "react";
import { HeaderComponent } from "../../Component/HeaderComponent";
import { Outlet } from "react-router-dom";

type Props = {};

const HomeTemplate = (props: Props) => {
  return (
    <div>
      <HeaderComponent />
      <div className="container mx-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeTemplate;
