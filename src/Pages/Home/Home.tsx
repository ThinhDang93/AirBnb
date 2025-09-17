import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoom, getRoomByID } from "../../redux/reducers/RoomReducer";
import RoomCart from "./ComponentHome/RoomCart";
import type { RootState, DispatchType } from "../../redux/store";
import { NavLink } from "react-router-dom";
import type { HomeRoomType } from "../../assets/Models/Room";

const Home = () => {
  const dispatch: DispatchType = useDispatch();

  // Lấy dữ liệu từ Redux store
  const arrRoombyid = useSelector(
    (state: RootState) => state.RoomReducer.arrRoombyid
  );

  const { arrAllroom } = useSelector((state: RootState) => state.RoomReducer);

  const getAllRoomAPI = () => {
    dispatch(getAllRoom());
  };

  // Gọi API cho 3 mã vùng
  useEffect(() => {
    [1, 2, 3].forEach((id) => dispatch(getRoomByID(id))), getAllRoomAPI();
  }, [dispatch]);

  const regions = [
    { id: 1, name: "Vùng 1" },
    { id: 2, name: "Vùng 2" },
    { id: 3, name: "Vùng 3" },
  ];

  return (
    <>
      <div className="container grid grid-cols-4 gap-4 py-10">
        {arrAllroom.map((item: HomeRoomType, index: number) => (
          <RoomCart key={index} room={item} />
        ))}
      </div>
      <div className="container mx-auto px-4 py-10 space-y-12">
        {regions.map((region) => (
          <section key={region.id}>
            {/* Tiêu đề vùng */}
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              {region.name}
            </h3>

            {/* Grid danh sách phòng */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {arrRoombyid[region.id]?.map((room) => (
                <RoomCart key={room.id} room={room} />
              ))}

              {/* Nếu chưa có dữ liệu */}
              {(!arrRoombyid[region.id] ||
                arrRoombyid[region.id].length === 0) && (
                <p className="text-gray-500 col-span-full text-center">
                  Không có phòng nào ở {region.name}.
                </p>
              )}
            </div>
          </section>
        ))}
      </div>
    </>
  );
};

export default Home;
