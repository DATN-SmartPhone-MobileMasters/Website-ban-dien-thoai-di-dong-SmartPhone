import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchPromotion, updateVoucherStatus, getProducts } from "../../../service/api";
import {
  Table,
  Button,
  Input,
  Checkbox,
  Typography,
  Space,
  Alert,
  Popconfirm,
  message,
} from "antd";
import { DeleteOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const navigate = useNavigate();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
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

  const updateCart = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (userId) {
      const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

      const updatedCart = await Promise.all(
        storedCart.map(async (item) => {
          try {
            const response = await getProducts(item.id);
            const productData = response.data.data;

            let newPrice = item.price;
            let newQuantity = item.totalQuantity;
            const newName = item.name;

            if (productData.BoNhoTrong1 === item.memory) {
              newPrice = productData.GiaSP1;
              newQuantity = productData.SoLuong1;
            } else if (productData.BoNhoTrong2 === item.memory) {
              newPrice = productData.GiaSP2;
              newQuantity = productData.SoLuong2;
            } else if (productData.BoNhoTrong3 === item.memory) {
              newPrice = productData.GiaSP3;
              newQuantity = productData.SoLuong3;
            }

            return {
              ...item,
              price: newPrice,
              name: productData.TenSP,
              totalQuantity: newQuantity,
            };
          } catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error);
            return item;
          }
        }),
      );

      setCart(updatedCart);
      const initialSelection = updatedCart.reduce((acc, _, index) => {
        acc[index] = true;
        return acc;
      }, {});
      setSelectedItems(initialSelection);
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    updateCart();

    window.addEventListener("cartUpdated", updateCart);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        updateCart();
      }
    });

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      document.removeEventListener("visibilitychange", () => {});
    };
  }, [navigate]);

  const removeItemFromCart = (index) => {
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

    message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    window.location.reload();
  };

  const increaseQuantity = (index) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + 1;

    if (newQuantity > newCart[index].totalQuantity) {
      message.warning("Đã đạt đến giới hạn sản phẩm.");
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
      message.error("Không thể lấy danh sách mã giảm giá.");
      return;
    }

    const promotion = promotions.data.find((promo) => promo.MaKM === voucher);

    if (!promotion) {
      message.error("Mã giảm giá không hợp lệ.");
      return;
    }

    if (promotion.TrangThai === 1) {
      message.error("Mã giảm giá này đã được sử dụng.");
      return;
    }

    const currentDate = new Date();
    const startDate = new Date(promotion.NgayBD);
    const endDate = new Date(promotion.NgayKT);

    if (currentDate < startDate || currentDate > endDate) {
      message.error("Mã giảm giá không còn hiệu lực.");
      return;
    }

    const total = calculateTotal();

    if (promotion.LoaiKM === "fixed" && total < promotion.GiaTriKM) {
      message.error("Tổng tiền trong giỏ hàng không đủ để áp dụng voucher này.");
      return;
    }

    let discountAmount = 0;
    if (promotion.LoaiKM === "percentage") {
      discountAmount = (total * promotion.GiaTriKM) / 100;
    } else {
      discountAmount = promotion.GiaTriKM;
    }

    setDiscount(discountAmount);
    message.success("Áp dụng mã giảm giá thành công!");

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

  const calculateOriginalTotal = () => {
    return cart.reduce((total, item, index) => {
      if (selectedItems[index]) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const calculateDiscountAmount = () => {
    const total = calculateTotal();
    let discountAmount = discount;

    if (total - discount > 50000000) {
      discountAmount += (total - discount) * 0.05;
    }

    return discountAmount;
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

  const columns = [
    {
      title: (
        <Checkbox
          checked={Object.keys(selectedItems).length > 0 && Object.values(selectedItems).every((val) => val)}
          onChange={(e) => {
            const newSelectedItems = {};
            cart.forEach((_, index) => {
              newSelectedItems[index] = e.target.checked;
            });
            setSelectedItems(newSelectedItems);
          }}
        />
      ),
      dataIndex: "index",
      key: "select",
      render: (text, record, index) => (
        <Checkbox
          checked={selectedItems[index] || false}
          onChange={() => handleSelectItem(index)}
        />
      ),
      width: 50,
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text, record, index) => (
        <Space size="large">
          <img
            src={record.image || "/placeholder.svg"}
            alt={record.name}
            style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 8 }}
          />
          <div>
            <Text strong style={{ fontSize: 16 }}>{record.name}</Text>
            <div>
              <Text type="secondary">Bộ nhớ: {record.memory}</Text>
            </div>
            <div>
              <Text type="secondary">
                Màu sắc:{" "}
                <span
                  style={{
                    display: "inline-block",
                    width: 20,
                    height: 20,
                    backgroundColor: record.color,
                    border: "1px solid #d9d9d9",
                    borderRadius: 4,
                    marginLeft: 8,
                  }}
                />
              </Text>
            </div>
          </div>
        </Space>
      ),
      width: 400,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => <Text strong>{formatCurrency(price)}</Text>,
      align: "center",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record, index) => (
        <Space direction="vertical" align="center">
          <Space>
            <Button
              icon={<MinusOutlined />}
              onClick={() => decreaseQuantity(index)}
              disabled={quantity <= 1}
            />
            <Text>{quantity}</Text>
            <Button
              icon={<PlusOutlined />}
              onClick={() => increaseQuantity(index)}
              disabled={quantity >= record.totalQuantity}
            />
          </Space>
          <Text type="secondary">Tối đa: {record.totalQuantity} sản phẩm</Text>
        </Space>
      ),
      align: "center",
    },
    {
      title: "Tổng",
      key: "total",
      render: (text, record) => (
        <Text strong>{formatCurrency(record.price * record.quantity)}</Text>
      ),
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record, index) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
          onConfirm={() => removeItemFromCart(index)}
          okText="Có"
          cancelText="Không"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Popconfirm>
      ),
      align: "center",
    },
  ];

  return (
    <div className="container" style={{ padding: "24px" }}>
      <Title level={2}>🛒 Giỏ hàng của bạn</Title>

      {cart.length === 0 ? (
        <Alert message="Giỏ hàng trống." type="warning" showIcon />
      ) : (
        <>
          <Table
            columns={columns}
            dataSource={cart}
            rowKey={(record, index) => index}
            pagination={false}
            style={{ marginBottom: 24 }}
          />

          <div style={{ maxWidth: 400, marginLeft: "auto" }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Title level={4}>Tổng tiền: {formatCurrency(calculateOriginalTotal())}</Title>
              {discount > 0 && (
                <Text type="danger">
                  Giảm giá từ voucher: -{formatCurrency(discount)}
                </Text>
              )}
              {calculateAdditionalDiscount() > 0 && (
                <Text type="danger">
                  Giảm thêm 5%: -{formatCurrency(calculateAdditionalDiscount())}
                </Text>
              )}
              {calculateFinalTotal() < calculateOriginalTotal() && (
                <Text type="success" strong>
                  Tổng tiền sau giảm giá: {formatCurrency(calculateFinalTotal())}
                </Text>
              )}

              <Input.Search
                placeholder="Nhập mã giảm giá"
                value={voucher}
                onChange={handleVoucherChange}
                onSearch={applyVoucher}
                enterButton="Áp dụng"
                style={{ marginTop: 16 }}
              />

              <Link
                to="/checkcart"
                state={{
                  cart: cart.filter((_, index) => selectedItems[index]),
                  total: calculateOriginalTotal(),
                  finalTotal: calculateFinalTotal(),
                  discount: discount,
                  additionalDiscount: calculateAdditionalDiscount(),
                }}
              >
                <Button type="primary" block size="large">
                  Thanh toán
                </Button>
              </Link>
            </Space>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;