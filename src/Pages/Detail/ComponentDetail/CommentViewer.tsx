import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { DispatchType, RootState } from "../../../redux/store";
import { getCommentByIdActionThunk } from "../../../redux/reducers/CommentReducer";
import { Star } from "lucide-react";

const CommentViewer = () => {
  const { id } = useParams();
  const dispatch: DispatchType = useDispatch();

  const { arrCommentByID } = useSelector(
    (state: RootState) => state.CommentReducer
  );

  useEffect(() => {
    if (id) dispatch(getCommentByIdActionThunk(id));
  }, [id, dispatch]);

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 py-10 space-y-6">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold text-gray-900">
        Đánh giá từ khách hàng
      </h2>

      {/* Danh sách bình luận */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {arrCommentByID.map((comment) => (
          <div
            key={comment.id}
            className="flex gap-4 pb-6 border-b border-gray-200 last:border-none group"
          >
            {/* Avatar */}
            <img
              src={comment.avatar || "/placeholder-avatar.png"}
              alt={comment.tenNguoiBinhLuan}
              className="w-14 h-14 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform duration-200"
            />

            {/* Nội dung */}
            <div className="flex-1">
              {/* Tên + rating */}
              <div className="flex flex-col">
                <h4 className="font-semibold text-gray-900 text-lg">
                  {comment.tenNguoiBinhLuan}
                </h4>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < comment.saoBinhLuan
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Nội dung bình luận */}
              <p className="text-gray-700 mt-3 leading-relaxed">
                {comment.noiDung}
              </p>
            </div>
          </div>
        ))}

        {arrCommentByID.length === 0 && (
          <p className="text-gray-500 text-center py-6 col-span-2">
            Chưa có đánh giá nào cho phòng này.
          </p>
        )}
      </div>
    </section>
  );
};

export default CommentViewer;
