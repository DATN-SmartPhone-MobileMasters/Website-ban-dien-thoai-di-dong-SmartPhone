import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDanhGias } from '../../../service/api';
import moment from 'moment';
import { Spin, Select } from 'antd';

const { Option } = Select;
const COLORS = ["#ff5252", "#ff9800", "#ffeb3b", "#8bc34a", "#2196f3"];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <p><strong>{payload[0].payload.date}</strong></p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>{entry.name}: {entry.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const ThongKeDanhGia = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(moment().year());
  const [month, setMonth] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const response = await fetchDanhGias();
        const danhGias = response.data?.data ?? [];

        const groupedData = [];
        const starCountsByDate = {};
        const yearsSet = new Set();

        danhGias.forEach((dg) => {
          const date = moment(dg.created_at);
          const formattedDate = date.format("YYYY-MM-DD");
          const star = Number(dg.DanhGia);
          yearsSet.add(date.year());
          
          if (date.year() !== year || (month !== null && date.month() + 1 !== month)) {
            return;
          }
          
          if (!starCountsByDate[formattedDate]) {
            starCountsByDate[formattedDate] = { date: formattedDate };
            [1, 2, 3, 4, 5].forEach((s) => {
              starCountsByDate[formattedDate][s] = 0;
            });
          }
          
          starCountsByDate[formattedDate][star] += 1;
        });

        Object.values(starCountsByDate).forEach((entry) => {
          groupedData.push(entry);
        });

        setAvailableYears(Array.from(yearsSet).sort((a, b) => b - a));
        setData(groupedData);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu thống kê đánh giá:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [year, month]);

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ textAlign: 'center' }}>Thống kê số lượng đánh giá theo ngày</h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Select value={year} onChange={setYear} style={{ width: 120, marginRight: 10 }}>
          {availableYears.map((y) => (
            <Option key={y} value={y}>{y}</Option>
          ))}
        </Select>
        <Select value={month} onChange={setMonth} style={{ width: 120 }} allowClear placeholder="Chọn tháng">
          {[...Array(12)].map((_, index) => (
            <Option key={index + 1} value={index + 1}>{index + 1}</Option>
          ))}
        </Select>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'block', textAlign: 'center', marginTop: 50 }} />
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />
            <Legend />
            {[1, 2, 3, 4, 5].map((star, index) => (
              <Bar
                key={star}
                dataKey={star}
                fill={COLORS[index]}
                stroke={COLORS[index]}
                barSize={50}
                stackId="a"
                name={`${star} Sao`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ThongKeDanhGia;