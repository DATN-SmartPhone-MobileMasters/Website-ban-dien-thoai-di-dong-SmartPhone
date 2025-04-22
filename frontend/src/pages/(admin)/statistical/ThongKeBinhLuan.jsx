import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { fetchComments } from '../../../service/api';
import moment from 'moment';
import { Card, Typography, Select, Spin, message } from 'antd';

Chart.register(...registerables);

const { Title } = Typography;
const { Option } = Select;

const ThongKeBinhLuan = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(null);
  const [month, setMonth] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchComments();
        const commentData = response.data || [];

        const yearsSet = new Set(commentData.map(cmt => moment(cmt.NgayBL).year()));
        setAvailableYears([...yearsSet].sort((a, b) => b - a));
        setComments(commentData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu bình luận:', error);
        message.error('Lỗi khi tải dữ liệu bình luận');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChartData = () => {
    const stats = {};

    comments.forEach((comment) => {
      const date = moment(comment.NgayBL);

      if ((year && date.year() !== year) || (month && date.month() + 1 !== month)) {
        return;
      }

      const formattedDate = date.format('YYYY-MM-DD');
      stats[formattedDate] = (stats[formattedDate] || 0) + 1;
    });

    const labels = Object.keys(stats).sort();
    const data = labels.map(label => stats[label]);

    return {
      labels,
      datasets: [
        {
          label: 'Số lượng bình luận',
          data,
          backgroundColor: 'rgba(33, 150, 243, 0.6)',
          borderColor: 'rgba(33, 150, 243, 1)',
          borderWidth: 1,
        },
      ],
    };
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
        Thống Kê Số Lượng Bình Luận Theo Ngày
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
              legend: { display: true, position: 'top' },
              tooltip: { enabled: true },
            },
            scales: {
              x: {
                ticks: { autoSkip: false, maxRotation: 45, minRotation: 0 },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Số lượng bình luận',
                },
              },
            },
          }}
        />
      </div>
    </Card>
  );
};

export default ThongKeBinhLuan;
