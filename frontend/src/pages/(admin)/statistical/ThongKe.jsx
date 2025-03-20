import React, { useEffect, useState, useRef } from 'react';
import { fetchThongKeDoanhThu } from "../../../service/api";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ThongKe = () => {
  const [thongKeDoanhThu, setThongKeDoanhThu] = useState({
    doanhThuTheoNgay: [],
    doanhThuTheoTuan: [],
    doanhThuTheoThang: [],
    doanhThuTheoNam: [],
    tongDoanhThuTheoNgay: 0,
    tongDoanhThuTheoTuan: 0
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchThongKeDoanhThu();
        setThongKeDoanhThu(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thống kê doanh thu:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (thongKeDoanhThu.doanhThuTheoNgay.length > 0) {
      const ctx = document.getElementById('myAreaChart')?.getContext('2d');
      if (ctx) {
        if (chartRef.current) {
          chartRef.current.destroy();
        }
        chartRef.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: thongKeDoanhThu.doanhThuTheoNgay.map(item => item._id),
            datasets: [{
              label: 'Doanh Thu Theo Ngày',
              data: thongKeDoanhThu.doanhThuTheoNgay.map(item => item.tongDoanhThu),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [thongKeDoanhThu.doanhThuTheoNgay]);

  return (
    <div>
      {/* Doanh thu theo ngày */}
      <div style={{ padding: '10px', fontFamily: 'Arial' }}>
        <h2 style={{ color: '#333', marginBottom: '8px' }}>Theo Ngày</h2>
        <select
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {thongKeDoanhThu.doanhThuTheoNgay.map((item) => (
            <option key={item._id} value={item._id}>
              {item._id}: {item.tongDoanhThu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </option>
          ))}
        </select>
      </div>
      <div className="row">
        {/* Tuần */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                Tuần:
              </div>
              <div className="h5 mb-0 font-weight-bold text-gray-800">
                <p>{thongKeDoanhThu.tongDoanhThuTheoTuan.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tháng */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                Chọn Tháng:
              </div>
              <select className="form-control font-weight-bold text-gray-800 custom-select">
                {thongKeDoanhThu.doanhThuTheoThang.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item._id}: {item.tongDoanhThu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Năm */}
        <div className="col-xl-4 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                Chọn Năm:
              </div>
              <select className="form-control font-weight-bold text-gray-800">
                {thongKeDoanhThu.doanhThuTheoNam.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item._id}: {item.tongDoanhThu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ doanh thu theo ngày */}
      <div className="chart-area">
        <canvas id="myAreaChart"></canvas>
      </div>
    </div>
  );
};

export default ThongKe;
