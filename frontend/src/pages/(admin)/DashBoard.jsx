import React, { useEffect, useState, useRef } from 'react';
import { fetchThongKeDoanhThu } from '../../service/api';
import TopProducts from "./statistical/TopProducts";
import { Chart, registerables } from 'chart.js';

// Register the necessary components
Chart.register(...registerables);

const DashBoard = () => {
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
        const data = response.data;
        
        setThongKeDoanhThu(data);
      } catch (error) {
        console.error('Lỗi khi lấy thống kê doanh thu:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (thongKeDoanhThu.doanhThuTheoNgay.length > 0) {
      const ctx = document.getElementById('myAreaChart').getContext('2d');
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

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [thongKeDoanhThu.doanhThuTheoNgay]);

  return (
    <>
      {/* Page Heading */}
      
      {/* Content Row */}
      <div className="row">
        {/* Tuần */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Tuần: 
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                  <p>{thongKeDoanhThu.tongDoanhThuTheoTuan.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-calendar fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
       
        {/* Tháng */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Tháng: 
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                      <ul>
                        {thongKeDoanhThu.doanhThuTheoThang.map((item) => (
                          <li key={item._id}>
                            {item._id}: {item.tongDoanhThu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                          </li>
                        ))}
                      </ul>
                      </div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm mr-2">
                        <div
                          className="progress-bar bg-info"
                          role="progressbar"
                          style={{ width: "50%" }}
                          aria-valuenow={50}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                <i className="fas fa-calendar fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Năm */}
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Năm: 
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                  <ul>
                    {thongKeDoanhThu.doanhThuTheoNam.map((item) => (
                      <li key={item._id}>
                        {item._id}: {item.tongDoanhThu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </li>
                    ))}
                  </ul>
                  </div>
                </div>
                <div className="col-auto">
                <i className="fas fa-calendar fa-2x text-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Content Row */}
      <div className="row">
        {/* Area Chart */}
        <div className="col-xl-8 col-lg-7">
          <div className="card shadow mb-4">
            {/* Card Header - Dropdown */}
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Earnings Overview
              </h6>
              <div className="dropdown no-arrow">
                <a
                  className="dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div className="dropdown-header">Dropdown Header:</div>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </div>
            </div>
            {/* Card Body */}
            <div className="card-body">
              <div className="chart-area">
                <canvas id="myAreaChart" />
              </div>
              <div>
                <h2>Theo Ngày</h2>
                <ul>
                  {thongKeDoanhThu.doanhThuTheoNgay.map((item) => (
                    <li key={item._id}>
                      {item._id}: {item.tongDoanhThu.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/* Pie Chart */}
        <div className="col-xl-4 col-lg-5">
          <div className="card shadow mb-4">
            {/* Card Header - Dropdown */}
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Revenue Sources
              </h6>

              <div className="dropdown no-arrow">
                <a
                  className="dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                </a>
                <div
                  className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                  aria-labelledby="dropdownMenuLink"
                >
                  <div className="dropdown-header">Dropdown Header:</div>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                  <div className="dropdown-divider" />
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </div>
              </div>
            </div>
            {/* Card Body */}
            <div className="card-body">
              <TopProducts />
              <div className="chart-pie pt-4 pb-2">
                <canvas id="myPieChart" />
              </div>
              <div className="mt-4 text-center small">
                <span className="mr-2">
                  <i className="fas fa-circle text-primary" />
                  Direct
                </span>
                <span className="mr-2">
                  <i className="fas fa-circle text-success" /> Social
                </span>
                <span className="mr-2">
                  <i className="fas fa-circle text-info" /> Referral
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;