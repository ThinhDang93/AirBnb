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

  // ✅ Chuẩn hoá từ khoá tìm kiếm (bỏ dấu, trim, lowercase)
  const normalizeText = (text: string) =>
    text
      ?.trim()
      .replace(/\s+/g, " ")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // ✅ Xử lý tìm kiếm
  const handleSearch = async () => {
    const normalizedSearch = normalizeText(keyword);

    if (!normalizedSearch) {
      // Nếu input trống → lấy toàn bộ
      dispatch(getAllRoom());
      dispatch(setArrFilterLoca(arrAllLocation));
      return;
    }

    dispatch(setTrue());

    // Lọc dữ liệu với normalize
    const filtered = arrAllLocation.filter((loc) => {
      const normalizedTinh = normalizeText(loc.tinhThanh);
      return normalizedTinh.includes(normalizedSearch);
    });

    dispatch(setArrFilterLoca(filtered));
  };

  // ✅ Nếu user xoá hết text → tự reset danh sách
  useEffect(() => {
    if (keyword.trim() === "") {
      dispatch(setArrFilterLoca(arrAllLocation));
    }
  }, [keyword, arrAllLocation, dispatch]);

  return (
    <div className="w-full max-w-xl mx-auto p-2">
      <div className="flex items-center bg-white border border-gray-300 rounded-full shadow-md hover:shadow-lg transition-all duration-200">
        {/* Input */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Bạn muốn đi đâu?"
          className="flex-1 rounded-full px-5 py-3 placeholder-gray-700 hover:bg-gray-200 border-none outline-none focus:outline-none focus:ring-0"
        />

        {/* Clear button */}
        {keyword && (
          <button
            onClick={() => setKeyword("")}
            className="text-gray-500 hover:text-gray-700 text-lg mr-1"
          >
            ✕
          </button>
        )}

        {/* Divider */}
        <div className="h-6 w-px bg-gray-300 mx-2" />

        {/* Search button */}
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
