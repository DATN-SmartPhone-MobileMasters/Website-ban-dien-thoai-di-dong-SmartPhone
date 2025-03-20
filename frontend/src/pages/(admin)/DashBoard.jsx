import React from 'react';
import TopProducts from "./statistical/TopProducts";
import { Chart, registerables } from 'chart.js';
import ThongKe from './statistical/ThongKe';
import ThongKeDanhGia from './statistical/ThongKeDanhGia';
// Đăng ký các component cần thiết của Chart.js
Chart.register(...registerables);

const DashBoard = () => {
  return (
    <div className="w-full px-4">
      <div className="grid grid-cols-1 gap-6">
        
        {/* Biểu đồ thống kê */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h6 className="text-lg font-bold text-blue-800 mb-4">Thống kê doanh thu</h6>
          <ThongKe />
        </div>

        {/* Danh sách sản phẩm top */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h6 className="text-lg font-bold text-blue-800 mb-4">Thống kê sản phẩm bán chạy</h6>
          <TopProducts />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h6 className="text-lg font-bold text-blue-800 mb-4">Thống kê đánh giá của hàng</h6>
          <ThongKeDanhGia />
        </div>

      </div>
    </div>
  );
};

export default DashBoard;
