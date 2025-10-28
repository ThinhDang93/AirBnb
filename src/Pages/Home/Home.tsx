import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoomByID, getRoomByPage } from "../../redux/reducers/RoomReducer";
import RoomCart from "./ComponentHome/RoomCart";
import type { RootState, DispatchType } from "../../redux/store";
import type { HomeRoomType } from "../../assets/Models/Room";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { arrAllroom, arrRoombyid, arrRoomByPage, pagination } = useSelector(
    (state: RootState) => state.RoomReducer
  );

  const dispatch: DispatchType = useDispatch();
  const [pageIndex, setPageIndex] = useState(pagination.pageIndex);

  const { isSearch } = useSelector((state: any) => state.SearchReducer);
  const { arrFilteredLocation, arrAllLocation } = useSelector(
    (state: RootState) => state.LocationReducer
  );

  // ✅ Khi không search, gọi API phân trang
  useEffect(() => {
    if (!isSearch && arrFilteredLocation.length === arrAllLocation.length) {
      dispatch(getRoomByPage(pageIndex));
    }
  }, [pageIndex]);
  // ✅ Khi có filter thật sự
  useEffect(() => {
    if (arrFilteredLocation.length > 0) {
      arrFilteredLocation.forEach((loc) => {
        if (!arrRoombyid[loc.id]) {
          dispatch(getRoomByID(loc.id));
        }
      });
    }
  }, [arrFilteredLocation, arrRoombyid]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPageIndex(newPage);
    }
  };

  return (
    <>
      <Helmet>
        <title>Trang chủ | AirBnB Clone</title>
        <meta
          name="description"
          content="Đặt phòng du lịch, homestay, villa, khách sạn giá tốt nhất."
        />
      </Helmet>

      <div className="container py-10 space-y-10">
        {/* ❌ Không tìm thấy */}
        {arrFilteredLocation.length === 0 &&
        arrAllLocation.length > 0 &&
        isSearch === true ? (
          <p className="text-center text-gray-500 italic">
            ❌ Không tìm thấy thành phố phù hợp
          </p>
        ) : arrFilteredLocation.length === arrAllLocation.length ||
          isSearch === false ? (
          <>
            {/* ✅ Render danh sách phòng */}
            <div className="grid grid-cols-4 gap-4">
              {(arrRoomByPage.length > 0 ? arrRoomByPage : arrAllroom).map(
                (room: HomeRoomType) => (
                  <RoomCart key={room.id} room={room} />
                )
              )}
            </div>

            {/* ✅ Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mt-6">
                <button
                  disabled={pageIndex === 1}
                  onClick={() => {
                    handlePageChange(pageIndex - 1);
                    dispatch(getRoomByPage(pageIndex - 1));
                  }}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  ⬅ Prev
                </button>

                <span>
                  Trang {pageIndex} / {pagination.totalPages}
                </span>

                <button
                  disabled={pageIndex === pagination.totalPages}
                  onClick={() => {
                    handlePageChange(pageIndex + 1);
                    dispatch(getRoomByPage(pageIndex + 1));
                  }}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next ➡
                </button>
              </div>
            )}
          </>
        ) : (
          // ✅ Có filter → render theo từng vị trí
          arrFilteredLocation.map((loc) => (
            <div key={loc.id}>
              <div className="mb-4 flex items-center gap-4">
                <img
                  src={loc.hinhAnh}
                  alt={loc.tenViTri}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <h2 className="text-xl font-bold">{loc.tenViTri}</h2>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {arrRoombyid[loc.id]?.length > 0 ? (
                  arrRoombyid[loc.id].map((room: HomeRoomType) => (
                    <RoomCart key={room.id} room={room} />
                  ))
                ) : (
                  <p className="col-span-4 text-gray-500 italic">
                    Không có phòng nào cho vị trí này.
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Home;
