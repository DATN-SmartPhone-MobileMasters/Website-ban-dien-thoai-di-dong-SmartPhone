import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchBrands } from "../../../service/api";

const MobileShowcase = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();

  // Gọi API lấy danh sách thương hiệu
  useEffect(() => {
    const getBrands = async () => {
      try {
        const res = await fetchBrands();
        setBrands(res.data.data || []);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách thương hiệu:", error);
      }
    };
    getBrands();
  }, []);
  return (
    <div className="w-[250px] bg-white shadow-xl p-4 rounded-lg flex flex-col items-center space-y-4 border border-gray-200">
      <h2 className="text-2xl font-semibold text-center">Thương hiệu</h2>
      {brands.map((brand) => (
        <div
          key={brand._id}
          className="w-full flex justify-center p-2 hover:bg-gray-100 rounded-lg transition-all cursor-pointer"
        >
          <img
            src={brand.HinhAnh}
            alt={brand.TenTH}
            className="w-24 h-12 object-contain"
          />
        </div>
      ))}
    </div>
  );
};

export default MobileShowcase;
