import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPromotion, getProducts } from "../../../service/api";
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

  const getMemoryKey = (memory, availableMemories) => {
    if (memory === availableMemories.BoNhoTrong1) return "BoNhoTrong1";
    if (memory === availableMemories.BoNhoTrong2) return "BoNhoTrong2";
    if (memory === availableMemories.BoNhoTrong3) return "BoNhoTrong3";
    return "BoNhoTrong1";
  };

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
      const storedVoucher = JSON.parse(localStorage.getItem(`voucher_${userId}`));

      const updatedCart = await Promise.all(
        storedCart.map(async (item) => {
          try {
            const response = await getProducts(item.id);
            const productData = response.data.data;

            let newPrice = item.price;
            let newMaxQuantity = item.maxQuantity;

            if (productData.BoNhoTrong1 === item.memory) {
              newPrice = productData.GiaSP1;
              newMaxQuantity = productData.SoLuong1;
            } else if (productData.BoNhoTrong2 === item.memory) {
              newPrice = productData.GiaSP2;
              newMaxQuantity = productData.SoLuong2;
            } else if (productData.BoNhoTrong3 === item.memory) {
              newPrice = productData.GiaSP3;
              newMaxQuantity = productData.SoLuong3;
            }

            return {
              ...item,
              price: newPrice,
              name: productData.TenSP,
              maxQuantity: newMaxQuantity,
              availableMemories: {
                BoNhoTrong1: productData.BoNhoTrong1,
                BoNhoTrong2: productData.BoNhoTrong2,
                BoNhoTrong3: productData.BoNhoTrong3,
                GiaSP1: productData.GiaSP1,
                GiaSP2: productData.GiaSP2,
                GiaSP3: productData.GiaSP3,
                SoLuong1: productData.SoLuong1,
                SoLuong2: productData.SoLuong2,
                SoLuong3: productData.SoLuong3,
              },
            };
          } catch (error) {
            console.error("Lỗi khi lấy thông tin sản phẩm:", error);
            return item;
          }
        })
      );

      setCart(updatedCart);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));
      const initialSelection = updatedCart.reduce((acc, _, index) => {
        acc[index] = true;
        return acc;
      }, {});
      setSelectedItems(initialSelection);

      if (storedVoucher && storedVoucher.code) {
        setVoucher(storedVoucher.code);
        setDiscount(storedVoucher.discount);
      }
    }
  };

  const handleCartUpdate = (event) => {
    const deletedProductId = event.detail?.deletedProductId;
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (deletedProductId && userId) {
      let storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      const newStoredCart = storedCart.filter((item) => item.id !== deletedProductId);
      if (newStoredCart.length !== storedCart.length) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(newStoredCart));
        setCart(newStoredCart);

        if (newStoredCart.length === 0) {
          localStorage.removeItem(`voucher_${userId}`);
          setVoucher("");
          setDiscount(0);
        }

        const newSelectedItems = {};
        newStoredCart.forEach((_, index) => {
          newSelectedItems[index] = true;
        });
        setSelectedItems(newSelectedItems);

        message.info(`Sản phẩm với ID ${deletedProductId} đã bị xóa khỏi giỏ hàng!`);
      }
    } else {
      updateCart();
    }
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }

    updateCart();

    window.addEventListener("cartUpdated", handleCartUpdate);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        updateCart();
      }
    });

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      document.removeEventListener("visibilitychange", () => {});
    };
  }, [navigate]);

  const handleMemoryChange = async (index, memoryKey) => {
    const newCart = [...cart];
    const productData = newCart[index].availableMemories;
    const memoryIndex = memoryKey.slice(-1);

    const newMemory = productData[memoryKey];
    const newPrice = productData[`GiaSP${memoryIndex}`];
    const newMaxQuantity = productData[`SoLuong${memoryIndex}`];

    // Nếu bộ nhớ hết hàng, đặt quantity về 0
    // Nếu bộ nhớ còn hàng, đặt quantity về 1 nếu trước đó là 0, hoặc giữ nguyên nếu lớn hơn 0
    const currentQuantity = newCart[index].quantity;
    const newQuantity = newMaxQuantity === 0 ? 0 : currentQuantity === 0 ? 1 : Math.min(currentQuantity, newMaxQuantity);

    newCart[index] = {
      ...newCart[index],
      memory: newMemory,
      price: newPrice,
      maxQuantity: newMaxQuantity,
      quantity: newQuantity,
    };

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    }

    setCart(newCart);
    if (newMaxQuantity === 0) {
      message.warning(`Bộ nhớ ${newMemory} đã hết hàng`);
    } else {
      message.success(`Đã thay đổi bộ nhớ thành ${newMemory}`);
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const increaseQuantity = (index) => {
    const newCart = [...cart];
    const newQuantity = newCart[index].quantity + 1;

    if (newQuantity > newCart[index].maxQuantity) {
      message.warning("Đã đạt đến giới hạn sản phẩm.");
      return;
    }

    newCart[index].quantity = newQuantity;
    newCart[index].maxQuantity -= 1;

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    }

    setCart(newCart);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const decreaseQuantity = (index) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
      newCart[index].maxQuantity += 1;

      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.id;

      if (userId) {
        localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      }

      setCart(newCart);
      window.dispatchEvent(new Event("cartUpdated"));
    }
  };

  const removeItemFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
      if (newCart.length === 0) {
        localStorage.removeItem(`voucher_${userId}`);
        setVoucher("");
        setDiscount(0);
      }
    }

    setCart(newCart);

    const newSelectedItems = { ...selectedItems };
    delete newSelectedItems[index];
    setSelectedItems(newSelectedItems);

    message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    window.dispatchEvent(new Event("cartUpdated"));
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

    let discountAmount = 0;
    if (promotion.LoaiKM === "percentage") {
      discountAmount = (total * promotion.GiaTriKM) / 100;
    } else {
      discountAmount = promotion.GiaTriKM;
    }

    setDiscount(discountAmount);
    message.success("Áp dụng mã giảm giá thành công!");

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;
    if (userId) {
      localStorage.setItem(
        `voucher_${userId}`,
        JSON.stringify({ code: voucher, discount: discountAmount })
      );
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
    return total - discount;
  };

  const calculateOriginalTotal = () => {
    return cart.reduce((total, item, index) => {
      if (selectedItems[index]) {
        return total + item.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const handleVoucherChange = (e) => {
    setVoucher(e.target.value);
    if (e.target.value === "") {
      setDiscount(0);
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.id;
      if (userId) {
        localStorage.removeItem(`voucher_${userId}`);
      }
    }
  };

  const handleCheckout = () => {
    navigate("/checkcart", {
      state: {
        cart: cart.filter((_, index) => selectedItems[index]),
        total: calculateOriginalTotal(),
        finalTotal: calculateFinalTotal(),
        discount: discount,
      },
    });
  };

  const isAnyItemOutOfStock = cart.some((item) => item.maxQuantity === 0 && selectedItems[cart.indexOf(item)]);

  const columns = [
    {
      title: (
        <Checkbox
          checked={
            Object.keys(selectedItems).length > 0 &&
            Object.values(selectedItems).every((val) => val)
          }
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
            <Text strong style={{ fontSize: 16 }}>
              {record.name}
            </Text>
            <div>
              <Text type="secondary">
                Bộ nhớ: {record.memory}
                <div className="d-flex gap-2 mt-2">
                  {["BoNhoTrong1", "BoNhoTrong2", "BoNhoTrong3"].map((memoryKey) =>
                    record.availableMemories[memoryKey] ? (
                      <div key={memoryKey} style={{ position: "relative", textAlign: "center" }}>
                        <Button
                          type={
                            record.memory === record.availableMemories[memoryKey]
                              ? "primary"
                              : "default"
                          }
                          size="small"
                          onClick={() => handleMemoryChange(index, memoryKey)}
                        >
                          {record.availableMemories[memoryKey]}
                        </Button>
                        {record.memory === record.availableMemories[memoryKey] &&
                          record.availableMemories[`SoLuong${memoryKey.slice(-1)}`] === 0 && (
                            <Text
                              type="danger"
                              style={{
                                display: "block",
                                fontSize: 12,
                                marginTop: 4,
                                whiteSpace: "nowrap",
                              }}
                            >
                              Hết hàng
                            </Text>
                          )}
                      </div>
                    ) : null
                  )}
                </div>
              </Text>
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
              disabled={record.maxQuantity <= 0}
            />
          </Space>
          <Text type="secondary">Còn lại: {record.maxQuantity}</Text>
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
              {calculateFinalTotal() < calculateOriginalTotal() && (
                <Text type="success" strong>
                  Tổng tiền sau giảm giá: {formatCurrency(calculateFinalTotal())}
                </Text>
              )}

              {isAnyItemOutOfStock && (
                <Alert
                  message="Sản phẩm đã hết hàng"
                  type="error"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}

              <Input.Search
                placeholder="Nhập mã giảm giá"
                value={voucher}
                onChange={handleVoucherChange}
                disabled={isAnyItemOutOfStock}
                enterButton={
                  <Popconfirm
                    title="Mỗi một voucher chỉ có thể áp dụng 1 lần. Bạn có chắc chắn muốn áp dụng không?"
                    onConfirm={applyVoucher}
                    okText="OK"
                    cancelText="Hủy"
                    disabled={isAnyItemOutOfStock}
                  >
                    <Button type="primary" disabled={isAnyItemOutOfStock}>
                      Áp dụng
                    </Button>
                  </Popconfirm>
                }
                style={{ marginTop: 16 }}
              />

              <Button
                type="primary"
                block
                size="large"
                onClick={handleCheckout}
                disabled={isAnyItemOutOfStock || !Object.values(selectedItems).some((val) => val)}
              >
                Thanh toán
              </Button>
            </Space>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;