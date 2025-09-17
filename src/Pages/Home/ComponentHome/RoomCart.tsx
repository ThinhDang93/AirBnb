import React from "react";
import type { HomeRoomType } from "../../../assets/Models/Room";
import { NavLink } from "react-router-dom";

type Props = {
  room: HomeRoomType;
};

const RoomCart = ({ room }: Props) => {
  return (
    <NavLink to={`/detail/${room.id}`}>
      <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
        {/* Hình ảnh */}
        <div className="relative w-full h-56 overflow-hidden">
          <img
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            src={room.hinhAnh || "/placeholder.jpg"}
            alt={room.tenPhong}
          />
        </div>

        {/* Thông tin */}
        <div className="flex flex-col justify-between flex-grow p-4">
          {/* Tên phòng */}
          <h5 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {room.tenPhong}
          </h5>

          {/* Giá + nút */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
              {room.giaTien?.toLocaleString("vi-VN")}₫
            </span>
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-xl shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all duration-200">
              Đặt phòng
            </button>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default RoomCart;
