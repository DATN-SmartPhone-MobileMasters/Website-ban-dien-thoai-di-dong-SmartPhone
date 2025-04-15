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

      chartRef.current = new Chart(canvasRef.current, {
        type: "bar",
        data: {
          labels: thongKeDoanhThu.doanhThuTheoNgay.map((item) => `${item._id.ngay} ${item._id.gio}h`),
          datasets: [
            {
              label: "Doanh Thu Theo Ngày",
              data: thongKeDoanhThu.doanhThuTheoNgay.map((item) => item.tongDoanhThu),
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

          // tooltip chart.js hiển thị chi tiết hơn trong biểu đồ
          plugins: {
           
            
            tooltip: {
              callbacks: {
                title: (tooltipItems) => {
                  const index = tooltipItems[0].dataIndex;
                  const item = thongKeDoanhThu.doanhThuTheoNgay[index];
                  return `Ngày: ${item.date || item._id.ngay}`;
                },
                label: (tooltipItem) => {
                  const index = tooltipItem.dataIndex;
                  const products = thongKeDoanhThu.doanhThuTheoNgay[index].sanPhamDaBan;
                
                  return products.map((p) => 
                    `${p.TenSP} (${p.memory}) - ${p.quantity} sản phẩm - Bán lúc: ${p.thoiGianBan}`
                  );
                }
                
              },
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
