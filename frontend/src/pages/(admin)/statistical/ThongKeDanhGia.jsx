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
  const [weekType, setWeekType] = useState('real'); // 'iso' hoặc 'real'

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetchDanhGias();
        const danhGias = response.data?.data ?? [];

        // Lấy danh sách các năm có dữ liệu
        const yearsSet = new Set();
        danhGias.forEach((dg) => yearsSet.add(moment(dg.created_at).year()));
        setAvailableYears([...yearsSet].sort((a, b) => b - a));

        const filteredDanhGias = danhGias.filter((dg) => {
          const date = moment(dg.created_at);
          return (!year || date.year() === year) && (!month || date.month() + 1 === month);
        });

        let stats = {};

        if (weekType === 'iso') {
          // ISO week grouping
          filteredDanhGias.forEach((dg) => {
            const date = moment(dg.created_at);
            const star = Number(dg.DanhGia);
            const week = date.isoWeek();
            const weekYear = date.isoWeekYear();
            const weekLabel = `Tuần ${week} - ${weekYear}`;

            if (!stats[weekLabel]) {
              stats[weekLabel] = { label: weekLabel, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
            }
            stats[weekLabel][star]++;
          });
        } else {
          // Thống kê theo tuần cố định 7 ngày lùi từ ngày mới nhất
          if (filteredDanhGias.length === 0) {
            setData([]);
            return;
          }

          const sorted = [...filteredDanhGias].sort((a, b) =>
            moment(a.created_at).valueOf() - moment(b.created_at).valueOf()
          );

          const latestDate = moment(sorted[sorted.length - 1].created_at).endOf('day');
          const earliestDate = moment(sorted[0].created_at).startOf('day');

          let weekIndex = 1;
          let weekEnd = moment(latestDate).endOf('day');

          while (weekEnd.isAfter(earliestDate)) {
            const weekStart = moment(weekEnd).subtract(6, 'days').startOf('day');
            const weekLabel = `Tuần ${weekIndex} (${weekStart.format('DD/MM')} - ${weekEnd.format('DD/MM')})`;

            const weekData = sorted.filter((dg) => {
              const date = moment(dg.created_at).startOf('day');
              return date.isBetween(weekStart.clone().subtract(1, 'ms'), weekEnd.clone().add(1, 'ms'));
            });

            weekData.forEach((dg) => {
              const star = Number(dg.DanhGia);
              if (!stats[weekLabel]) {
                stats[weekLabel] = { label: weekLabel, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
              }
              stats[weekLabel][star]++;
            });

            weekEnd = weekStart.clone().subtract(1, 'day');
            weekIndex++;
          }
        }

        const sortedStats = Object.values(stats).sort((a, b) => {
          const numA = parseInt(a.label.match(/\d+/)[0]);
          const numB = parseInt(b.label.match(/\d+/)[0]);
          return numA - numB;
        });

        setData(sortedStats);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê đánh giá:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [year, month, weekType]);

  const getChartData = () => {
    const labels = data.map((item) => item.label);
    const datasets = [1, 2, 3, 4, 5].map((star, index) => ({
      label: `${star} Sao`,
      data: data.map((item) => item[star] || 0),
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
        Thống Kê Đánh Giá Theo Tuần
      </Title>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
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

        <Select
          value={weekType}
          onChange={setWeekType}
          style={{ width: 200 }}
          placeholder="Kiểu thống kê"
        >
          <Option value="real">Tuần (7 ngày gần nhất)</Option>
          <Option value="iso">Tuần ISO</Option>
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
