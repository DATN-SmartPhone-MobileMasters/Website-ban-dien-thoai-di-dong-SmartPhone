import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "react-confirm-alert/src/react-confirm-alert.css";

Chart.register(...registerables);

const API_URL = "http://localhost:5000/api";

const TopProducts = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [productStats, setProductStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ year: "", month: "", day: "" });
  const [availableYears, setAvailableYears] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/hoadons`);
        setHoaDons(data.data);

        const years = new Set();
        data.data.forEach((hoaDon) => {
          const year = new Date(hoaDon.createdAt).getFullYear();
          years.add(year);
        });
        setAvailableYears(years);

        const currentYear = new Date().getFullYear();
        if (!filter.year && years.has(currentYear)) {
          setFilter((prev) => ({ ...prev, year: currentYear.toString() }));
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách hóa đơn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const calculateProductStats = () => {
      const stats = {};
  
      hoaDons.forEach((hoaDon) => {
        if (hoaDon.paymentStatus === "Hoàn thành" || hoaDon.paymentStatus === "Giao Hàng Thành Công") {
          const date = new Date(hoaDon.createdAt);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
  
          if (
            (filter.year === "" || year === parseInt(filter.year)) &&
            (filter.month === "" || month === parseInt(filter.month)) &&
            (filter.day === "" || day === parseInt(filter.day))
          ) {
            hoaDon.products.forEach((product) => {
              const key = `${year}-${month}-${day}`;
  
              if (!stats[key]) {
                stats[key] = {};
              }
  
              if (!stats[key][product.name]) {
                stats[key][product.name] = 0;
              }
  
              stats[key][product.name] += product.quantity;
            });
          }
        }
      });
  
      setProductStats(stats);
    };
  
    calculateProductStats();
  }, [hoaDons, filter]);
  
  const getChartData = () => {
    const labels = Object.keys(productStats).sort();
    const datasets = [];

    const productNames = new Set();
    Object.values(productStats).forEach((dailyStats) => {
      Object.keys(dailyStats).forEach((productName) => {
        productNames.add(productName);
      });
    });

    productNames.forEach((productName) => {
      const data = labels.map((label) => productStats[label][productName] || 0);
      datasets.push({
        label: productName,
        data,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      });
    });

    return {
      labels,
      datasets,
    };
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="text-center">
          <div className="spinner-border text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-blue-800">Đang tải thông tin thống kê...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h6 className="text-lg font-bold text-blue-800 mb-4">Sản phẩm bán chạy</h6>

        {/* Bộ lọc theo ngày, tháng, năm */}
        <div className="flex gap-4 mb-6">
          <select
            name="year"
            value={filter.year}
            onChange={handleFilterChange}
            className="p-2 border border-blue-200 rounded"
          >
            {Array.from(availableYears).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            name="month"
            value={filter.month}
            onChange={handleFilterChange}
            className="p-2 border border-blue-200 rounded"
          >
            <option value="">Chọn tháng</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </option>
            ))}
          </select>

          <select
            name="day"
            value={filter.day}
            onChange={handleFilterChange}
            className="p-2 border border-blue-200 rounded"
          >
            <option value="">Chọn ngày</option>
            {Array.from({ length: 31 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Ngày {i + 1}
              </option>
            ))}
          </select>
        </div>

        {/* Biểu đồ */}
        <div className="w-full h-[500px]">
          <Bar
            data={getChartData()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
              },
              scales: {
                x: {
                  ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 },
                },
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
