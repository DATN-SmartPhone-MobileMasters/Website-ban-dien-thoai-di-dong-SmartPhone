import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { fetchDanhGias } from '../../../service/api';
import moment from 'moment';
import { Card, Typography, Select, Spin } from 'antd';

Chart.register(...registerables);

const { Title } = Typography;
const { Option } = Select;
const COLORS = [
  'rgba(255, 82, 82, 0.6)',    // 1 sao
  'rgba(255, 152, 0, 0.6)',   // 2 sao
  'rgba(255, 235, 59, 0.6)',  // 3 sao
  'rgba(139, 195, 74, 0.6)',  // 4 sao
  'rgba(33, 150, 243, 0.6)',  // 5 sao
];

const ThongKeDanhGia = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetchDanhGias();
        const danhGias = response.data?.data ?? [];

        const yearsSet = new Set();
        danhGias.forEach((dg) => yearsSet.add(moment(dg.created_at).year()));
        setAvailableYears([...yearsSet].sort((a, b) => b - a));

        const stats = {};
        danhGias.forEach((dg) => {
          const date = moment(dg.created_at);
          const formattedDate = date.format('YYYY-MM-DD');
          const star = Number(dg.DanhGia);

          if ((year && date.year() !== year) || (month && date.month() + 1 !== month)) {
            return;
          }

          if (!stats[formattedDate]) {
            stats[formattedDate] = { date: formattedDate, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          }
          stats[formattedDate][star]++;
        });

        setData(Object.values(stats));
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê đánh giá:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [year, month]);

  const getChartData = () => {
    const labels = data.map((item) => item.date).sort();
    const datasets = [1, 2, 3, 4, 5].map((star, index) => ({
      label: `${star} Sao`,
      data: labels.map((label) => data.find((d) => d.date === label)?.[star] || 0),
      backgroundColor: COLORS[index],
      borderColor: COLORS[index].replace('0.6', '1'),
      borderWidth: 1,
    }));

    return { labels, datasets };
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#1890ff' }}>Đang tải thông tin thống kê...</p>
      </div>
    );
  }

  return (
    <Card
      style={{
        margin: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Title level={3} style={{ textAlign: 'center', marginBottom: '24px', color: '#1890ff' }}>
        Thống Kê Đánh Giá Theo Ngày
      </Title>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
        <Select
          value={year}
          onChange={setYear}
          style={{ width: 140 }}
          placeholder="Chọn năm"
          allowClear
        >
          {availableYears.map((y) => (
            <Option key={y} value={y}>{y}</Option>
          ))}
        </Select>

        <Select
          value={month}
          onChange={setMonth}
          style={{ width: 140 }}
          placeholder="Chọn tháng"
          allowClear
        >
          {Array.from({ length: 12 }, (_, i) => (
            <Option key={i + 1} value={i + 1}>Tháng {i + 1}</Option>
          ))}
        </Select>
      </div>

      <div style={{ height: '500px' }}>
        <Bar
          data={getChartData()}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'top' },
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
    </Card>
  );
};

export default ThongKeDanhGia;