import React, { useEffect, useState, useRef } from "react";
import { fetchThongKeDoanhThu } from "../../../service/api";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const ThongKe = () => {
  const [thongKeDoanhThu, setThongKeDoanhThu] = useState({
    doanhThuTheoNgay: [],
    doanhThuTheoTuan: [],
    doanhThuTheoThang: [],
    doanhThuTheoNam: [],
    tongDoanhThuTheoNgay: 0,
    tongDoanhThuTheoTuan: 0,
  });

  const chartRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchThongKeDoanhThu();
        setThongKeDoanhThu(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thống kê doanh thu:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (thongKeDoanhThu.doanhThuTheoNgay.length > 0 && canvasRef.current) {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
  
      // Tính ngày bắt đầu (thứ 2) và ngày kết thúc (chủ nhật) của tuần hiện tại
      const today = new Date(2025, 3, 18); // Ngày hiện tại (thay đổi theo nhu cầu)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Đặt ngày là thứ 2
      startOfWeek.setHours(0, 0, 0, 0); // Đặt thời gian là đầu ngày
  
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); // Tiến đến chủ nhật
      endOfWeek.setHours(23, 59, 59, 999); // Đặt thời gian là cuối ngày
  
      // Lọc dữ liệu doanh thu theo ngày trong khoảng từ thứ 2 đến chủ nhật
      const filteredData = thongKeDoanhThu.doanhThuTheoNgay.filter((item) => {
        const itemDate = new Date(item._id.ngay);
        return itemDate >= startOfWeek && itemDate <= endOfWeek;
      });
  
      // Lấy nhãn và dữ liệu cho biểu đồ
      const labels = filteredData.map((item) => item._id.ngay);
      const data = filteredData.map((item) => item.tongDoanhThu);
  
      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Doanh Thu Theo Ngày",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [thongKeDoanhThu.doanhThuTheoNgay]);

  return (
    <div style={{ width: "100%", padding: "20px", fontFamily: "Arial" }}>
      {/* Tiêu đề */}
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#333", marginBottom: "8px" }}>Thống Kê Doanh Thu</h2>
      </div>

      {/* Cards thống kê */}
      <div className="row">
        {/* Tổng doanh thu theo tuần */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">Tổng Tuần</div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                {thongKeDoanhThu.tongDoanhThuTheoTuan?.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
              </div>
            </div>
          </div>
        </div>

        {/* Chọn tháng */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Chọn Tháng</div>
              <select className="form-control font-weight-bold text-gray-800 custom-select">
                {thongKeDoanhThu.doanhThuTheoThang.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item._id}: {item.tongDoanhThu.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chọn năm */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">Chọn Năm</div>
              <select className="form-control font-weight-bold text-gray-800">
                {thongKeDoanhThu.doanhThuTheoNam.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item._id}: {item.tongDoanhThu.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo ngày */}
      <div style={{ width: "100%", height: "500px" }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
};

export default ThongKe;
