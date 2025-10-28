import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllLocaActionThunk,
  setArrFilterLoca,
} from "../redux/reducers/LocationReducer";
import type { DispatchType, RootState } from "../redux/store";
import { getAllRoom } from "../redux/reducers/RoomReducer";
import { setTrue } from "../redux/reducers/SearchReducer";

const Search = () => {
  const [keyword, setKeyword] = useState("");
  const dispatch: DispatchType = useDispatch();

  const { arrAllLocation } = useSelector(
    (state: RootState) => state.LocationReducer
  );

  // ✅ Lấy all location khi load lần đầu
  useEffect(() => {
    dispatch(getAllLocaActionThunk());
  }, [dispatch]);

  // ✅ Hàm search
  const handleSearch = async () => {
    const trimmed = keyword.trim().toLowerCase();
    // Nếu rỗng → getAllRoom

    if (!trimmed) {
      dispatch(getAllRoom());
    }
    if (keyword !== "") {
      dispatch(setTrue());
    }

    if (arrAllLocation.length === 0) {
      dispatch(setArrFilterLoca(arrAllLocation));
    }

    // Lọc trực tiếp từ arrAllLocation
    const filtered = arrAllLocation.filter((loc) =>
      loc.tinhThanh.toLowerCase().includes(trimmed)
    );

    if (filtered.length > 0) {
      dispatch(setArrFilterLoca(filtered));
    } else {
      // Không có kết quả → set rỗng nhưng kèm cờ báo "not found"
      dispatch(setArrFilterLoca([]));
    }
    // console.log(trimmed, arrAllLocation, filtered);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-2 ">
      <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200 ">
        {/* Input */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          placeholder="Bạn muốn đi đâu?"
          className="flex-1 rounded-full px-5 py-3  placeholder-gray-700 hover:bg-gray-200 border-none outline-none focus:outline-none focus:ring-0"
        />

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 mx-2" />

        {/* Button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center w-10 h-10 bg-pink-600 hover:bg-pink-700 rounded-full text-white transition-colors mr-2"
        >
          🔍
        </button>
      </div>
    </div>
  );
};

export default Search;
