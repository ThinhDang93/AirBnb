import React, { useState } from "react";

const Search = () => {
  // State lưu ô nào đang được chọn
  const [active, setActive] = useState<string>("location");

  // Danh sách các ô
  const items = [
    { key: "location", label: "Location", placeholder: "Enter location" },
    { key: "check-in", label: "Check-in", placeholder: "Add date" },
    { key: "check-out", label: "Check-out", placeholder: "Add date" },
    { key: "guests", label: "Who", placeholder: "Add guests" },
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Container chính */}
      <div
        className="flex items-center rounded-full border border-gray-300 
        shadow-sm bg-white overflow-hidden"
      >
        {/* Các ô */}
        {items.map((item, index) => (
          <React.Fragment key={item.key}>
            <a
              onClick={() => setActive(item.key)}
              className={`flex flex-col px-6 py-3 cursor-pointer transition-colors 
                ${
                  active === item.key
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
            >
              <span className="text-xs font-semibold">{item.label}</span>
              <span className="text-sm text-gray-400">{item.placeholder}</span>
            </a>

            {/* Gạch dọc ngăn cách, không thêm ở phần tử cuối */}
            {index < items.length - 1 && (
              <div className="h-10 w-px bg-gray-300" />
            )}
          </React.Fragment>
        ))}

        {/* Nút Search */}
        <button
          type="button"
          className="ml-3 mr-3 flex items-center justify-center w-10 h-10 
          bg-blue-700 hover:bg-blue-800 rounded-full text-white transition-colors"
        >
          <svg
            className="w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Search;
