import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRoom, getRoomByID } from "../../redux/reducers/RoomReducer";
import RoomCart from "./ComponentHome/RoomCart";
import type { RootState, DispatchType } from "../../redux/store";
import type { HomeRoomType } from "../../assets/Models/Room";

const Home = () => {
  const dispatch: DispatchType = useDispatch();
  const { isSearch } = useSelector((state: any) => state.SearchReducer);

  const { arrAllroom, arrRoombyid } = useSelector(
    (state: RootState) => state.RoomReducer
  );
  const { arrFilteredLocation, arrAllLocation } = useSelector(
    (state: RootState) => state.LocationReducer
  );
  // Khi arrFilteredLocation thay đổi => gọi API phù hợp
  useEffect(() => {
    if (arrFilteredLocation.length === arrAllLocation.length) {
      // ⬅ đây là case: user search rỗng → show all
      dispatch(getAllRoom());
    } else if (arrFilteredLocation.length > 0) {
      // ⬅ có filter thật sự
      arrFilteredLocation.forEach((loc) => {
        if (!arrRoombyid[loc.id]) {
          dispatch(getRoomByID(loc.id));
        }
      });
    }
    // nếu length === 0 và !== arrAllLocation.length → notfound
  }, [arrFilteredLocation, arrAllLocation.length, dispatch, arrRoombyid]);

  return (
    <div className="container py-10 space-y-10">
      {/* Trường hợp không tìm thấy */}
      {arrFilteredLocation.length === 0 &&
      arrAllLocation.length > 0 &&
      isSearch === true ? ( // allLocation > 0 để tránh khi mới load
        <p className="text-center text-gray-500 italic">
          ❌ Không tìm thấy thành phố phù hợp
        </p>
      ) : arrFilteredLocation.length === arrAllLocation.length ||
        isSearch === false ? (
        // Trường hợp search rỗng → getAll
        <div className="grid grid-cols-4 gap-4">
          {arrAllroom.map((room: HomeRoomType) => (
            <RoomCart key={room.id} room={room} />
          ))}
        </div>
      ) : (
        // Có filter → render theo từng vị trí
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
  );
};

export default Home;

/**
 *
 * - Phần hiện thị thông tin và chức năng userLogin ở HeaderComponent
 *
 * - Phần thêm: so sánh giữa các room
 */
