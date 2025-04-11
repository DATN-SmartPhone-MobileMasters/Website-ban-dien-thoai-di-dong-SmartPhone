import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { message, Select, DatePicker } from "antd";
import { fetchOrders } from "../../../service/api";

// Hàm formatDate để định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return "Không có";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const { Option } = Select;

const OrderList = () => {
  const [hoaDons, setHoaDons] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [hiddenOrders, setHiddenOrders] = useState([]);
  const [showHidden, setShowHidden] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // Bộ lọc trạng thái
  const [dateFilter, setDateFilter] = useState(""); // Bộ lọc ngày
  const [sortTotal, setSortTotal] = useState(""); // Bộ lọc sắp xếp tổng tiền
  const location = useLocation();

  useEffect(() => {
    const getHoaDons = async () => {
      try {
        const response = await fetchOrders();
        const storedHiddenOrders = JSON.parse(localStorage.getItem("hiddenOrders")) || [];
        setHiddenOrders(storedHiddenOrders);
        // Sort orders by createdAt in descending order (newest first)
        const all = (response.data.data || []).sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAllOrders(all);
        applyFilters(all, storedHiddenOrders);
      } catch (error) {
        console.error("Lỗi khi tải danh sách hóa đơn:", error);
        message.error("Lỗi khi tải danh sách hóa đơn!");
      }
    };

    getHoaDons();
  }, [location.key, showHidden]);

  // Hàm áp dụng các bộ lọc
  const applyFilters = (orders, hiddenOrders) => {
    let filtered = [...orders];

    // Lọc theo trạng thái hiển thị (ẩn hoặc không ẩn)
    filtered = showHidden
      ? filtered.filter((order) => hiddenOrders.includes(order._id))
      : filtered.filter((order) => !hiddenOrders.includes(order._id));

    // Lọc theo trạng thái đơn hàng
    if (statusFilter) {
      filtered = filtered.filter((order) => order.paymentStatus === statusFilter);
    }

    // Lọc theo ngày
    if (dateFilter) {
      filtered = filtered.filter((order) => {
        const createdAt = formatDate(order.createdAt);
        return createdAt === dateFilter;
      });
    }

    // Sắp xếp theo tổng tiền
    if (sortTotal === "low-to-high") {
      filtered = filtered.sort((a, b) => (a.total || 0) - (b.total || 0));
    } else if (sortTotal === "high-to-low") {
      filtered = filtered.sort((a, b) => (b.total || 0) - (a.total || 0));
    } else {
      // Default sorting: newest orders first
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setHoaDons(filtered);
  };

  // Cập nhật bộ lọc khi thay đổi
  useEffect(() => {
    applyFilters(allOrders, hiddenOrders);
  }, [statusFilter, dateFilter, sortTotal, allOrders, hiddenOrders]);

  const handleHideOrder = (id) => {
    const updatedHiddenOrders = [...hiddenOrders, id];
    setHiddenOrders(updatedHiddenOrders);
    localStorage.setItem("hiddenOrders", JSON.stringify(updatedHiddenOrders));
    applyFilters(allOrders, updatedHiddenOrders);
    message.success("Đã ẩn đơn hàng thành công");
  };

  const handleRestoreOrder = (id) => {
    const updatedHiddenOrders = hiddenOrders.filter((item) => item !== id);
    setHiddenOrders(updatedHiddenOrders);
    localStorage.setItem("hiddenOrders", JSON.stringify(updatedHiddenOrders));
    applyFilters(allOrders, updatedHiddenOrders);
    message.success("Đã khôi phục đơn hàng");
  };

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Danh sách hóa đơn</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3 d-flex justify-content-between align-items-center">
          <h6 className="m-0 font-weight-bold text-primary">Database hóa đơn</h6>
          <button
            className="btn btn-secondary"
            onClick={() => setShowHidden(!showHidden)}
          >
            {showHidden ? "🔙 Quay lại danh sách chính" : "👻 Xem đơn hàng đã ẩn"}
          </button>
        </div>
        <div className="card-body">
          {/* Bộ lọc */}
          <div className="mb-4 d-flex gap-4">
            <div>
              <label className="mr-2">Lọc theo trạng thái:</label>
              <Select
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
                style={{ width: 200 }}
                placeholder="Chọn trạng thái"
                allowClear
              >
                <Option value="">Tất cả</Option>
                <Option value="Chờ xử lý">Chờ xử lý</Option>
                <Option value="Đang giao">Đang giao</Option>
                <Option value="Hoàn thành">Hoàn thành</Option>
                <Option value="Huỷ Đơn">Huỷ Đơn</Option>
              </Select>
            </div>
            <div>
              <label className="mr-2">Lọc theo ngày:</label>
              <DatePicker
                format="DD/MM/YYYY"
                onChange={(date, dateString) => setDateFilter(dateString)}
                style={{ width: 200 }}
                placeholder="Chọn ngày"
                allowClear
              />
            </div>
            <div>
              <label className="mr-2">Sắp xếp tổng tiền:</label>
              <Select
                value={sortTotal}
                onChange={(value) => setSortTotal(value)}
                style={{ width: 200 }}
                placeholder="Chọn sắp xếp"
                allowClear
              >
                <Option value="">Mặc định</Option>
                <Option value="low-to-high">Thấp đến cao</Option>
                <Option value="high-to-low">Cao đến thấp</Option>
              </Select>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-bordered dataTable no-footer">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Ngày tạo</th>
                  <th>Người nhận</th>
                  <th>Số điện thoại</th>
                  <th>Địa chỉ</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {hoaDons.length > 0 ? (
                  hoaDons.map((hoaDon, i) => (
                    <tr key={hoaDon._id}>
                      <td>{i + 1}</td>
                      <td>{formatDate(hoaDon.createdAt)}</td>
                      <td>{hoaDon.shippingInfo.name || "Không có"}</td>
                      <td>{hoaDon.shippingInfo.phone || "Không có"}</td>
                      <td>{hoaDon.shippingInfo.address || "Không có"}</td>
                      <td>
                        {hoaDon.total
                          ? `${hoaDon.total.toLocaleString()} VND`
                          : "Không có"}
                      </td>
                      <td>{hoaDon.paymentStatus || "Không có"}</td>
                      <td>
                        <Link
                          to={`/admin/orders/${hoaDon._id}`}
                          className="btn btn-info ml-2"
                        >
                          👁️ Xem chi tiết
                        </Link>
                        {!showHidden &&
                          (hoaDon.paymentStatus === "Huỷ Đơn" ||
                            hoaDon.paymentStatus === "Hoàn thành") && (
                            <button
                              onClick={() => handleHideOrder(hoaDon._id)}
                              className="btn btn-warning ml-2"
                            >
                              🚫 Ẩn đơn hàng
                            </button>
                          )}
                        {showHidden && (
                          <button
                            onClick={() => handleRestoreOrder(hoaDon._id)}
                            className="btn btn-success ml-2"
                          >
                            ♻️ Khôi phục
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      Không có dữ liệu hóa đơn.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;