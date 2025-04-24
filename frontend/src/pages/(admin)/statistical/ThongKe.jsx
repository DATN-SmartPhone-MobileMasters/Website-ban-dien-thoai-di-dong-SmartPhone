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
  
      // Lấy tháng và năm hiện tại
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
  
      // Tạo danh sách tất cả ngày trong tháng hiện tại
      const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate(); // số ngày trong tháng
      const fullMonthDates = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(currentYear, currentMonth, i + 1);
        return date.toISOString().split("T")[0]; // yyyy-mm-dd
      });
  
      // Tạo map từ dữ liệu doanh thu để tra nhanh
      const doanhThuMap = new Map(
        thongKeDoanhThu.doanhThuTheoNgay.map((item) => [item._id.ngay, item.tongDoanhThu])
      );
  
      // Tạo data cho biểu đồ
      const labels = fullMonthDates;
      const data = fullMonthDates.map((date) => doanhThuMap.get(date) || 0);
  
      // Tạo biểu đồ
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
          plugins: {  
            tooltip: {  
              callbacks: {  
                title: (tooltipItems) => {  
                  const date = tooltipItems[0].label; 
                  const doanhThuItem = thongKeDoanhThu.doanhThuTheoNgay.find(item => item._id.ngay === date);  
          
                   
                  const totalRevenue = doanhThuItem ? doanhThuItem.tongDoanhThu.toLocaleString("vi-VN", {  
                    style: "currency",  
                    currency: "VND"  
                  }) : 0;  
          
                  return `Ngày: ${date}\nTổng doanh thu: ${totalRevenue}`;  
                },  
                label: (tooltipItem) => {  
                  const date = tooltipItem.label;  
                  const doanhThuItem = thongKeDoanhThu.doanhThuTheoNgay.find(  
                    (item) => item._id.ngay === date  
                  );  
                
                  if (!doanhThuItem || !doanhThuItem.sanPhamDaBan || doanhThuItem.sanPhamDaBan.length === 0) {  
                    return "Không có chi tiết sản phẩm.";  
                  }  
                
                  // Gộp số lượng sản phẩm trùng nhau
                  const productMap = new Map();
                  doanhThuItem.sanPhamDaBan.forEach((sp) => {
                    const key = `${sp.TenSP} (${sp.memory})`;
                    if (productMap.has(key)) {
                      productMap.set(key, productMap.get(key) + sp.quantity);
                    } else {
                      productMap.set(key, sp.quantity);
                    }
                  });
                
                  // Tạo chuỗi hiển thị, mỗi sản phẩm mới xuống dòng
                  return Array.from(productMap.entries())
                  .map(([key, quantity]) => `${key} x${quantity}`);
                
                },   
              },  
            },  
          },  
        }
        
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




