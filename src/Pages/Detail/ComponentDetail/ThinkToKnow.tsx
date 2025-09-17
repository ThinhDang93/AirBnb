import React from "react";
import { ShieldCheck, Ban, CalendarX2 } from "lucide-react";

const ThingsToKnow = () => {
  return (
    <section className="bg-white rounded-2xl shadow-md p-8 space-y-8">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold text-gray-900">Những điều cần biết</h2>

      {/* 3 cột */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Quy định */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Ban className="text-gray-800" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">Quy định</h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li>Nhận phòng sau 14:00</li>
            <li>Trả phòng trước 12:00</li>
            <li>Không hút thuốc</li>
            <li>Không thú cưng</li>
          </ul>
        </div>

        {/* An toàn & tài sản */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-gray-800" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              An toàn & tài sản
            </h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li>Có bình chữa cháy</li>
            <li>Có chuông báo cháy</li>
            <li>Khu vực an ninh 24/7</li>
          </ul>
        </div>

        {/* Chính sách hủy */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CalendarX2 className="text-gray-800" size={20} />
            <h3 className="text-lg font-semibold text-gray-900">
              Chính sách hủy
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            Hủy miễn phí trước 5 ngày. Sau đó, hủy sẽ bị tính phí 50% tổng số
            tiền đặt phòng.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ThingsToKnow;
