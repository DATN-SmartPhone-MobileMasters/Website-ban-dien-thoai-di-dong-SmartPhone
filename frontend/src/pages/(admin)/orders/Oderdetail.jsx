import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";

const API_URL = "http://localhost:5000/api";

const Orderdetail = () => {
  const [hoaDon, setHoaDon] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/hoadons/${id}`);
        setHoaDon(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    confirmAlert({
      title: "Xác nhận thay đổi trạng thái",
      message: "Bạn có chắc chắn muốn thay đổi trạng thái?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              // Cập nhật trạng thái đơn hàng
              await axios.put(`${API_URL}/hoadons/${id}`, {
                paymentStatus: newStatus,
              });
  
              alert("Cập nhật trạng thái thành công!");
              navigate("/admin/orders");
            } catch (error) {
              console.error("Lỗi khi cập nhật trạng thái:", error);
              alert("Có lỗi xảy ra khi cập nhật trạng thái!");
            }
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="text-center">
          <div className="spinner-border text-blue-600" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-blue-800">Đang tải thông tin hóa đơn...</p>
        </div>
      </div>
    );
  }

  if (!hoaDon) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-blue-800">Không tìm thấy hóa đơn</h2>
          <p className="text-blue-600 mt-2">Hóa đơn bạn đang tìm kiếm không tồn tại.</p>
          <Link
            to="/admin/orders"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800 transition duration-200"
          >
            <i className="fas fa-long-arrow-alt-left mr-2"></i> Quay lại danh sách hóa đơn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-gray-50">
      <div className="container mx-auto p-8">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-blue-800">Chi tiết hóa đơn</h1>

          {/* Thông tin sản phẩm */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Sản phẩm</h2>
            <table className="table-auto w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="p-2 text-blue-600">Sản phẩm</th>
                  <th className="p-2 text-blue-600">Bộ nhớ</th>
                  <th className="p-2 text-blue-600">Màu</th>
                  <th className="p-2 text-blue-600">SL</th>
                  <th className="p-2 text-blue-600">Đơn giá</th>
                </tr>
              </thead>
              <tbody>
                {hoaDon.products?.map((product, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover mr-2"
                        />
                        <span className="text-blue-800">{product.name}</span>
                      </div>
                    </td>
                    <td className="p-2 text-blue-800">{product.memory}</td>
                    <td className="p-2 text-blue-800">{product.color}</td>
                    <td className="p-2 text-blue-800">{product.quantity}</td>
                    <td className="p-2 text-blue-800">{product.price?.toLocaleString()}đ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Thông tin hóa đơn */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Thông tin hóa đơn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">Mã HĐ:</p>
                <p className="font-medium text-blue-800">{hoaDon._id}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">Ngày đặt:</p>
                <p className="font-medium text-blue-800">
                  {new Date(hoaDon.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">Phương thức thanh toán:</p>
                <p className="font-medium text-blue-800">{hoaDon.paymentMethod}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">Tổng tiền:</p>
                <p className="font-medium text-blue-800">
                  {hoaDon.total?.toLocaleString()}đ
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">Trạng thái:</p>
                <p className="font-medium text-blue-800">{hoaDon.paymentStatus}</p>
              </div>
            </div>
          </div>

          {/* Thông tin khách hàng */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Thông tin khách hàng</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">Tên:</p>
                <p className="font-medium text-blue-800">{hoaDon.shippingInfo?.name || "N/A"}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">SĐT:</p>
                <p className="font-medium text-blue-800">{hoaDon.shippingInfo?.phone || "N/A"}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600">Địa chỉ:</p>
                <p className="font-medium text-blue-800">{hoaDon.shippingInfo?.address || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Cập nhật trạng thái */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">Cập nhật trạng thái</h3>
            <div className="flex gap-2 flex-wrap">
              {hoaDon.paymentStatus === "Chờ xử lý" && (
                <>
                  <button
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                    onClick={() => handleStatusChange("Đã Xác Nhận")}
                  >
                    ✅ Xác Nhận
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                    onClick={() => handleStatusChange("Huỷ Đơn")}
                  >
                    ❌ Huỷ Đơn
                  </button>
                </>
              )}

              {hoaDon.paymentStatus === "Đã Xác Nhận" && (
                <>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                    onClick={() => handleStatusChange("Đang Giao")}
                  >
                    🚚 Đang Giao
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-200"
                    onClick={() => handleStatusChange("Huỷ Đơn")}
                  >
                    ❌ Huỷ Đơn
                  </button>
                </>
              )}

              {hoaDon.paymentStatus === "Đang Giao" && (
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                  onClick={() => handleStatusChange("Hoàn thành")}
                >
                  ✅ Hoàn thành
                </button>
              )}
            </div>
          </div>

          {/* Quay lại danh sách */}
          <div className="mt-6">
            <Link
              to="/admin/orders"
              className="px-4 py-2 bg-blue-500 text-white rounded inline-block hover:bg-blue-600 transition duration-200"
            >
              🔙 Quay lại danh sách
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderdetail;