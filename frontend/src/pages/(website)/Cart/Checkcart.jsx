import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { getUserById, createOrder } from "../../../service/api";

const Checkcart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart: initialCart, total, discount, additionalDiscount } = location.state || {};
  const [userInfo, setUserInfo] = useState({});
  const [cart, setCart] = useState(initialCart || []);
  const [orderNote, setOrderNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData && userData.id) {
        try {
          const response = await getUserById(userData.id);
          setUserInfo(response.data);
        } catch (error) {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        }
      } else {
        console.error("Không có dữ liệu"); 
      }
    };
    fetchUserData();
  }, []);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    confirmAlert({
      title: 'Xác nhận đặt hàng',
      message: 'Bạn có chắc chắn muốn đặt hàng không?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            setIsSubmitting(true);
  
            const orderData = {
              userId: userInfo._id,
              products: cart.map(item => ({
                productId: item.id,
                image: item.image,
                name: item.name,
                memory: item.memory,
                color: item.color,
                quantity: item.quantity,
                price: item.price
              })),
              total: total - discount - additionalDiscount,
              discount,
              additionalDiscount,
              shippingInfo: {
                name: userInfo.HoVaTen,
                phone: userInfo.SDT,
                address: userInfo.DiaChi
              },
              orderNote
            };
  
            try {
              const response = await createOrder(orderData);
              if (response.data) {

                const userData = JSON.parse(localStorage.getItem("userData"));
                const userId = userData?.id;
  
                if (userId) {
                  localStorage.removeItem(`cart_${userId}`);
                }

                window.dispatchEvent(new Event("cartUpdated"));
  
                navigate(`/profile-receipt/${response.data._id}`);
              }
            } catch (error) {
              console.error('Lỗi khi tạo đơn hàng:', error);
              alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
            } finally {
              setIsSubmitting(false);
            }
          }
        },
        {
          label: 'Hủy',
          onClick: () => {}
        }
      ]
    });
  };

  if (!cart || cart.length === 0) {
    return <div className="container mt-4">Không có sản phẩm nào trong giỏ hàng.</div>;
  }

  return (
    <div className="container mt-4 p-3 border rounded bg-light shadow-sm">
      <form onSubmit={handleSubmitOrder}>
        <div className="mb-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/cart")}
          >
            Sửa sản phẩm đã chọn
          </button>
        </div>

        <h2 className="text-center">🛒 Thông tin thanh toán</h2>
        
        {userInfo.HoVaTen && (
          <div className="mb-4">
            <h4 className="mb-3">Thông tin giao hàng</h4>
            <p className="mb-1">Mã đơn hàng: {userInfo._id}</p>
            <p className="mb-1">Họ và tên: {userInfo.HoVaTen}</p>
            <p className="mb-1">Số điện thoại: {userInfo.SDT}</p>
            <p className="mb-1">Địa chỉ: {userInfo.DiaChi}</p>
          </div>
        )}

        <div className="row">
          <div className="col-md-12">
            <h4>Danh sách sản phẩm:</h4>
            {cart.map((item, index) => (
              <div key={index} className="mb-3 p-2">
                <div className="d-flex align-items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-thumbnail me-3"
                    style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="mb-1">{item.name}</h5>
                    <p className="mb-1">Bộ nhớ: {item.memory}</p>
                    <p className="mb-1 d-flex align-items-center">
                      Màu sắc: 
                      <span
                        style={{
                          display: "inline-block",
                          width: "20px",
                          height: "20px",
                          backgroundColor: item.color,
                          border: "1px solid #ccc",
                          borderRadius: "4px",
                          marginLeft: "8px",
                        }}
                      ></span>
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 fw-bold text-primary">Giá: {formatCurrency(item.price)} VND</p>
                    <p className="mb-1">Số lượng: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-light">
          <h4 className="mb-3">Tổng thanh toán</h4>
          <p className="fs-5">Tổng tiền: <strong>{formatCurrency(total)} VND</strong></p>
          {discount > 0 && (
            <p className="text-danger fs-6">Giảm giá từ voucher: -{formatCurrency(discount)} VND</p>
          )}
          {additionalDiscount > 0 && (
            <p className="text-danger fs-6">Giảm thêm 5%: -{formatCurrency(additionalDiscount)} VND</p>
          )}
          <h4 className="text-success mt-3">
            Tổng tiền sau giảm giá: {formatCurrency(total - discount - additionalDiscount)} VND
          </h4>
        </div>

        <div className="mt-3">
          <label>Ghi chú đơn hàng:</label>
          <textarea
            className="form-control"
            rows="3"
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
          ></textarea>
        </div>

        <div className="text-center mt-4">
          <button 
            type="submit" 
            className="btn btn-success btn-lg"
            disabled={cart.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : ' Thanh toán khi nhận hàng'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkcart;