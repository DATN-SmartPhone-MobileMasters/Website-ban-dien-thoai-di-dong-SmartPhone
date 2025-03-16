import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchPromotion, updateVoucherStatus } from "../../../service/api";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return value.toLocaleString("vi-VN");
  };

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetchPromotion();
        setPromotions(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy mã giảm giá:", error);
      }
    };

    fetchPromotions();
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    const updateCart = () => {
      if (userId) {
        const storedCart =
          JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        setCart(storedCart);

        const initialSelection = storedCart.reduce((acc, item, index) => {
          acc[index] = true;
          return acc;
        }, {});
        setSelectedItems(initialSelection);
      }
    };

    updateCart();
    window.addEventListener("cartUpdated", updateCart);

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
    };
  }, [navigate]);

  const removeItemFromCart = (index) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
    );
    if (confirmDelete) {
      const newCart = cart.filter((_, i) => i !== index);
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.id;

      if (userId) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      }

      setCart(newCart);

      const newSelectedItems = { ...selectedItems };
      delete newSelectedItems[index];
      setSelectedItems(newSelectedItems);

      window.location.reload();
    }
  };

  const increaseQuantity = (index) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + 1;

    if (newQuantity > newCart[index].totalQuantity) {
      alert("Đã đạt đến giới hạn sản phẩm.");
      return;
    }

    newCart[index].quantity = newQuantity;
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    }

    setCart(newCart);
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.id;

      if (userId) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      }

      setCart(newCart);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item, index) => {
      if (selectedItems[index]) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const applyVoucher = async () => {
    if (!promotions?.data || !Array.isArray(promotions.data)) {
      alert("Không thể lấy danh sách mã giảm giá.");
      return;
    }

    const promotion = promotions.data.find((promo) => promo.MaKM === voucher);

    if (!promotion) {
      alert("Mã giảm giá không hợp lệ.");
      return;
    }

    if (promotion.TrangThai === 1) {
      alert("Mã giảm giá này đã được sử dụng.");
      return;
    }

    const currentDate = new Date();
    const startDate = new Date(promotion.NgayBD);
    const endDate = new Date(promotion.NgayKT);

    if (currentDate < startDate || currentDate > endDate) {
      alert("Mã giảm giá không còn hiệu lực.");
      return;
    }

    const total = calculateTotal();

    if (promotion.LoaiKM === "fixed" && total < promotion.GiaTriKM) {
      alert("Tổng tiền trong giỏ hàng không đủ để áp dụng voucher này.");
      return;
    }

    let discountAmount = 0;
    if (promotion.LoaiKM === "percentage") {
      discountAmount = (total * promotion.GiaTriKM) / 100;
    } else {
      discountAmount = promotion.GiaTriKM;
    }

    setDiscount(discountAmount);
    alert("Áp dụng mã giảm giá thành công!");

    try {
      await updateVoucherStatus(promotion._id);
      console.log("Voucher đã bị khóa sau khi sử dụng");
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái voucher:", error.message);
    }
  };

  const handleSelectItem = (index) => {
    setSelectedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const calculateFinalTotal = () => {
    const total = calculateTotal();
    let finalTotal = total - discount;

    if (finalTotal > 50000000) {
      finalTotal *= 0.95;
    }

    return finalTotal;
  };

  const calculateAdditionalDiscount = () => {
    const total = calculateTotal();
    if (total - discount > 50000000) {
      return (total - discount) * 0.05;
    }
    return 0;
  };

  const handleVoucherChange = (e) => {
    setVoucher(e.target.value);
    if (e.target.value === "") {
      setDiscount(0);
    }
  };

  return (
    <div className="container mt-4">
      <h2>🛒 Giỏ hàng của bạn</h2>
      {cart.length === 0 ? (
        <div className="alert alert-warning">Giỏ hàng trống.</div>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="card mb-3">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems[index] || false}
                    onChange={() => handleSelectItem(index)}
                    className="form-check-input me-3"
                    style={{ width: "20px", height: "20px" }}
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="img-thumbnail me-3"
                    style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  />
                  <div className="flex-grow-1">
                    <h5 className="card-title">{item.name}</h5>
                    <p className="card-text">Bộ nhớ: {item.memory}</p>
                    <p className="card-text">
                      Màu sắc:{" "}
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
                    <p className="card-text">Giá: {formatCurrency(item.price)} VND</p>
                    <p className="card-text">Tổng Số lượng: {item.totalQuantity}</p>
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => decreaseQuantity(index)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => increaseQuantity(index)}
                      disabled={item.quantity >= item.maxQuantity}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-danger ms-3"
                    onClick={() => removeItemFromCart(index)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="mt-4">
            <h4>Tổng tiền: {formatCurrency(calculateTotal())} VND</h4>
            {discount > 0 && (
              <h4 className="text-danger">
                Giảm giá từ voucher: -{formatCurrency(discount)} VND
              </h4>
            )}
            {calculateAdditionalDiscount() > 0 && (
              <h4 className="text-danger">
                Giảm thêm 5%: -{formatCurrency(calculateAdditionalDiscount())} VND
              </h4>
            )}
            <h4 className="text-success">
              Tổng tiền sau giảm giá: {formatCurrency(calculateFinalTotal())} VND
            </h4>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Nhập mã giảm giá"
                value={voucher}
                onChange={handleVoucherChange}
              />
              <button className="btn btn-primary" onClick={applyVoucher}>
                Áp dụng
              </button>
            </div>
            <Link
              to="/checkcart"
              state={{
                cart: cart.filter((_, index) => selectedItems[index]),
                total: calculateTotal(),
                finalTotal: calculateFinalTotal(),
                discount: discount,
                additionalDiscount: calculateAdditionalDiscount(),
              }}
            >
              <button className="btn btn-success">Thanh toán</button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;