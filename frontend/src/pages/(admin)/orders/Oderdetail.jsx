import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
const API_URL = "http://localhost:5000/api";

const Orderdetail = () => {
  const [hoaDon, setHoaDon] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/hoadons/${id}`);
        setHoaDon(data.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết hóa đơn:", error);
      }
    };
    fetchData();
  }, [id]);

  // Trong Orderdetail.js
  const handleStatusChange = async (newStatus) => {
    confirmAlert({
      title: "Xác nhận thay đổi trạng thái",
      message: "Bạn có chắc chắn muốn thay đổi trạng thái?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.put(`${API_URL}/hoadons/${id}`, {
                paymentStatus: newStatus,
              });
  
              // Nếu trạng thái là "Đã Xác Nhận", trừ số lượng sản phẩm
              if (newStatus === "Đã Xác Nhận") {
                await updateProductQuantities(hoaDon.products, "subtract");
              }
  
              // Nếu trạng thái là "Huỷ Đơn", trả lại số lượng sản phẩm
              if (newStatus === "Huỷ Đơn") {
                await updateProductQuantities(hoaDon.products, "add");
              }
  
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
          onClick: () => {}, // Do nothing if "No" is clicked
        },
      ],
    });
  };
  
  const updateProductQuantities = async (products, action) => {
    for (const product of products) {
      try {
        // Lấy thông tin sản phẩm hiện tại
        const { data } = await axios.get(`${API_URL}/sanphams/${product.productId}`);
  
        // Xác định phiên bản sản phẩm dựa trên bộ nhớ được chọn
        let updatedQuantity1 = data.data.SoLuong1;
        let updatedQuantity2 = data.data.SoLuong2;
        let updatedQuantity3 = data.data.SoLuong3;
  
        if (product.memory === data.data.BoNhoTrong1) {
          updatedQuantity1 =
            action === "subtract"
              ? data.data.SoLuong1 - product.quantity
              : data.data.SoLuong1 + product.quantity;
        } else if (product.memory === data.data.BoNhoTrong2) {
          updatedQuantity2 =
            action === "subtract"
              ? data.data.SoLuong2 - product.quantity
              : data.data.SoLuong2 + product.quantity;
        } else if (product.memory === data.data.BoNhoTrong3) {
          updatedQuantity3 =
            action === "subtract"
              ? data.data.SoLuong3 - product.quantity
              : data.data.SoLuong3 + product.quantity;
        }
  
        // Cập nhật số lượng sản phẩm
        await axios.put(`${API_URL}/sanphams/${product.productId}`, {
          SoLuong1: updatedQuantity1,
          SoLuong2: updatedQuantity2,
          SoLuong3: updatedQuantity3,
        });
      } catch (error) {
        console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
      }
    }
  };

  if (!hoaDon) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chi tiết hóa đơn</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Thông tin khách hàng</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Tên:</p>
              <p>{hoaDon.shippingInfo?.name || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">SĐT:</p>
              <p>{hoaDon.shippingInfo?.phone || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">Địa chỉ:</p>
              <p>{hoaDon.shippingInfo?.address || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Chi tiết đơn hàng</h2>
          <div className="mb-4">
            <p className="font-medium">Mã HĐ: {hoaDon._id}</p>
            <p className="font-medium">
              Ngày đặt: {new Date(hoaDon.createdAt).toLocaleDateString()}
            </p>
            <p className="font-medium">
              Tổng tiền: {hoaDon.total?.toLocaleString()}đ
            </p>
            <p className="font-medium">Trạng thái: {hoaDon.paymentStatus}</p>
          </div>

          <table className="table-auto w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Sản phẩm</th>
                <th className="p-2">Bộ nhớ</th>
                <th className="p-2">Màu</th>
                <th className="p-2">SL</th>
                <th className="p-2">Đơn giá</th>
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
                      {product.name}
                    </div>
                  </td>
                  <td className="p-2">{product.memory}</td>
                  <td className="p-2">{product.color}</td>
                  <td className="p-2">{product.quantity}</td>
                  <td className="p-2">{product.price?.toLocaleString()}đ</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-3">Cập nhật trạng thái</h3>
          <div className="flex gap-2 flex-wrap">
            {hoaDon.paymentStatus === "Chờ xử lý" && (
              <>
                <button
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                  onClick={() => handleStatusChange("Đã Xác Nhận")}
                >
                  ✅Xác Nhận
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => handleStatusChange("Huỷ Đơn")}
                >
                  ❌Huỷ Đơn
                </button>
              </>
            )}

            {hoaDon.paymentStatus === "Đã Xác Nhận" && (
              <>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={() => handleStatusChange("Đang Giao")}
                >
                  🚚Đang Giao
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => handleStatusChange("Huỷ Đơn")}
                >
                  ❌Huỷ Đơn
                </button>
              </>
            )}

            {hoaDon.paymentStatus === "Đang Giao" && (
              <button
                className="px-4 py-2 bg-green-500 text-white rounded"
                onClick={() => handleStatusChange("Hoàn thành")}
              >
                ✅ Hoàn thành
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-blue-500 text-white rounded inline-block hover:bg-blue-600"
          >
            🔙 Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Orderdetail;
