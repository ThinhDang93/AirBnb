import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import type { DispatchType, RootState } from "../../../redux/store";
import { getCommentByIdActionThunk } from "../../../redux/reducers/CommentReducer";
import { Star } from "lucide-react";
import { useFormik } from "formik";
import type { CommentTypeByUser } from "../../../assets/Models/Comment";
import * as Yup from "yup";
import { postCommentByUser } from "../../../API/CommentAPI";

const CommentViewer = () => {
  const { id } = useParams();
  const dispatch: DispatchType = useDispatch();
  const navigate = useNavigate();

  const { arrCommentByID } = useSelector(
    (state: RootState) => state.CommentReducer
  );
  const { userInfoLogin } = useSelector(
    (state: RootState) => state.UserReducer
  );
  const { roomDetail } = useSelector((state: RootState) => state.RoomReducer);

  const frmCommentByUser = useFormik<
    Omit<CommentTypeByUser, "maPhong" | "maNguoiBinhLuan">
  >({
    initialValues: {
      id: -1,
      ngayBinhLuan: "",
      noiDung: "",
      saoBinhLuan: 5,
    },
    validationSchema: Yup.object({
      noiDung: Yup.string()
        .required("Vui lòng nhập nội dung bình luận")
        .min(5, "Nội dung quá ngắn"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!userInfoLogin) {
        alert("Vui lòng đăng nhập để viết bình luận");
        navigate(`/login?redirectTo=/detail/${id}`);
        return;
      }

      const payload: CommentTypeByUser = {
        ...values,
        ngayBinhLuan: new Date().toISOString(),
        maPhong: roomDetail?.id ?? Number(id),
        maNguoiBinhLuan: userInfoLogin?.id ?? 0,
      };

      try {
        await postCommentByUser(payload);
        alert("Gửi bình luận thành công!");
        resetForm(); // clear form sau khi gửi
        if (id) dispatch(getCommentByIdActionThunk(id)); // cập nhật lại danh sách bình luận
      } catch (err: any) {
        alert(err.response?.data?.message || "Gửi bình luận thất bại");
      }
    },
  });

  useEffect(() => {
    if (id) dispatch(getCommentByIdActionThunk(id));
  }, [id, dispatch]);

  return (
    <section className="bg-white rounded-2xl shadow-md p-6 py-10 space-y-6">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold text-gray-900">
        Đánh giá từ khách hàng
      </h2>

      {/* Form bình luận */}
      <form
        onSubmit={frmCommentByUser.handleSubmit}
        className="flex flex-col gap-4 border border-gray-200 rounded-xl p-4"
      >
        <label className="font-medium text-gray-700">
          Viết đánh giá của bạn
        </label>

        {/* Rating chọn sao */}
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={22}
              className={`cursor-pointer transition ${
                i < frmCommentByUser.values.saoBinhLuan
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
              onClick={() =>
                frmCommentByUser.setFieldValue("saoBinhLuan", i + 1)
              }
            />
          ))}
        </div>

        {/* Textarea nhập nội dung */}
        <textarea
          name="noiDung"
          className={`w-full border rounded-xl p-3 resize-none focus:ring-2 focus:ring-blue-400 focus:outline-none ${
            frmCommentByUser.errors.noiDung && frmCommentByUser.touched.noiDung
              ? "border-red-400"
              : "border-gray-300"
          }`}
          rows={3}
          placeholder="Hãy chia sẻ cảm nhận của bạn về phòng này..."
          value={frmCommentByUser.values.noiDung}
          onChange={frmCommentByUser.handleChange}
          onBlur={frmCommentByUser.handleBlur}
        ></textarea>

        {frmCommentByUser.errors.noiDung &&
          frmCommentByUser.touched.noiDung && (
            <p className="text-red-500 text-sm">
              {frmCommentByUser.errors.noiDung}
            </p>
          )}

        {/* Nút gửi */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={frmCommentByUser.isSubmitting}
            className={`px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium shadow ${
              frmCommentByUser.isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
          >
            {frmCommentByUser.isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
          </button>
        </div>
      </form>

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
