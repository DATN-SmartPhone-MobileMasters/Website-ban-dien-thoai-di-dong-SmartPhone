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
  Radio,
  Modal,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  MinusOutlined,
  TagOutlined,
} from "@ant-design/icons";
import io from "socket.io-client";

const { Title, Text } = Typography;

// Kết nối Socket.IO
const socket = io("http://localhost:5000", {
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [voucher, setVoucher] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promotions, setPromotions] = useState([]);
  const [tempVoucher, setTempVoucher] = useState("");
  const [tempDiscount, setTempDiscount] = useState(0);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
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
    if (memory === availableMemories.BoNhoTrong4) return "BoNhoTrong4";
    if (memory === availableMemories.BoNhoTrong5) return "BoNhoTrong5";
    if (memory === availableMemories.BoNhoTrong6) return "BoNhoTrong6";
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
      const storedCart =
        JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
      const storedVoucher = JSON.parse(
        localStorage.getItem(`voucher_${userId}`)
      );

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
            } else if (productData.BoNhoTrong4 === item.memory) {
              newPrice = productData.GiaSP4;
              newMaxQuantity = productData.SoLuong4;
            } else if (productData.BoNhoTrong5 === item.memory) {
              newPrice = productData.GiaSP5;
              newMaxQuantity = productData.SoLuong5;
            } else if (productData.BoNhoTrong6 === item.memory) {
              newPrice = productData.GiaSP6;
              newMaxQuantity = productData.SoLuong6;
            }

            let newQuantity = item.quantity;
            if (newMaxQuantity <= 0) {
              newQuantity = 0;
            } else if (newQuantity === 0) {
              newQuantity = 1; // Đặt số lượng mặc định là 1 nếu còn hàng
            } else if (newQuantity > newMaxQuantity) {
              newQuantity = newMaxQuantity;
            }

            return {
              ...item,
              price: newPrice,
              name: productData.TenSP,
              maxQuantity: newMaxQuantity,
              quantity: newQuantity,
              availableMemories: {
                BoNhoTrong1: productData.BoNhoTrong1,
                BoNhoTrong2: productData.BoNhoTrong2,
                BoNhoTrong3: productData.BoNhoTrong3,
                BoNhoTrong4: productData.BoNhoTrong4,
                BoNhoTrong5: productData.BoNhoTrong5,
                BoNhoTrong6: productData.BoNhoTrong6,
                GiaSP1: productData.GiaSP1,
                GiaSP2: productData.GiaSP2,
                GiaSP3: productData.GiaSP3,
                GiaSP4: productData.GiaSP4,
                GiaSP5: productData.GiaSP5,
                GiaSP6: productData.GiaSP6,
                SoLuong1: productData.SoLuong1,
                SoLuong2: productData.SoLuong2,
                SoLuong3: productData.SoLuong3,
                SoLuong4: productData.SoLuong4,
                SoLuong5: productData.SoLuong5,
                SoLuong6: productData.SoLuong6,
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
        acc[index] = updatedCart[index].maxQuantity > 0;
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
      const newStoredCart = storedCart.filter(
        (item) => item.id !== deletedProductId
      );
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
          newSelectedItems[index] = newStoredCart[index].maxQuantity > 0;
        });
        setSelectedItems(newSelectedItems);

        message.info(
          `Sản phẩm với ID ${deletedProductId} đã bị xóa khỏi giỏ hàng!`
        );
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

    socket.on("productUpdated", (updatedProduct) => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const userId = userData?.id;

      if (userId) {
        const storedCart =
          JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        const updatedCart = storedCart.map((item) => {
          if (item.id === updatedProduct._id) {
            let newPrice = item.price;
            let newMaxQuantity = item.maxQuantity;

            if (updatedProduct.BoNhoTrong1 === item.memory) {
              newPrice = updatedProduct.GiaSP1;
              newMaxQuantity = updatedProduct.SoLuong1;
            } else if (updatedProduct.BoNhoTrong2 === item.memory) {
              newPrice = updatedProduct.GiaSP2;
              newMaxQuantity = updatedProduct.SoLuong2;
            } else if (updatedProduct.BoNhoTrong3 === item.memory) {
              newPrice = updatedProduct.GiaSP3;
              newMaxQuantity = updatedProduct.SoLuong3;
            } else if (updatedProduct.BoNhoTrong4 === item.memory) {
              newPrice = updatedProduct.GiaSP4;
              newMaxQuantity = updatedProduct.SoLuong4;
            } else if (updatedProduct.BoNhoTrong5 === item.memory) {
              newPrice = updatedProduct.GiaSP5;
              newMaxQuantity = updatedProduct.SoLuong5;
            } else if (updatedProduct.BoNhoTrong6 === item.memory) {
              newPrice = updatedProduct.GiaSP6;
              newMaxQuantity = updatedProduct.SoLuong6;
            }

            let newQuantity = item.quantity;
            if (newMaxQuantity <= 0) {
              newQuantity = 0;
            } else if (newQuantity === 0) {
              newQuantity = 1; // Đặt số lượng mặc định là 1 nếu còn hàng
            } else if (newQuantity > newMaxQuantity) {
              newQuantity = newMaxQuantity;
            }

            return {
              ...item,
              price: newPrice,
              name: updatedProduct.TenSP,
              maxQuantity: newMaxQuantity,
              quantity: newQuantity,
              availableMemories: {
                BoNhoTrong1: updatedProduct.BoNhoTrong1,
                BoNhoTrong2: updatedProduct.BoNhoTrong2,
                BoNhoTrong3: updatedProduct.BoNhoTrong3,
                BoNhoTrong4: updatedProduct.BoNhoTrong4,
                BoNhoTrong5: updatedProduct.BoNhoTrong5,
                BoNhoTrong6: updatedProduct.BoNhoTrong6,
                GiaSP1: updatedProduct.GiaSP1,
                GiaSP2: updatedProduct.GiaSP2,
                GiaSP3: updatedProduct.GiaSP3,
                GiaSP4: updatedProduct.GiaSP4,
                GiaSP5: updatedProduct.GiaSP5,
                GiaSP6: updatedProduct.GiaSP6,
                SoLuong1: updatedProduct.SoLuong1,
                SoLuong2: updatedProduct.SoLuong2,
                SoLuong3: updatedProduct.SoLuong3,
                SoLuong4: updatedProduct.SoLuong4,
                SoLuong5: updatedProduct.SoLuong5,
                SoLuong6: updatedProduct.SoLuong6,
              },
            };
          }
          return item;
        });

        setCart(updatedCart);
        localStorage.setItem(`cart_${userId}`, JSON.stringify(updatedCart));

        const newSelectedItems = {};
        updatedCart.forEach((_, index) => {
          newSelectedItems[index] = updatedCart[index].maxQuantity > 0;
        });
        setSelectedItems(newSelectedItems);

        message.info(
          `Sản phẩm ${updatedProduct.TenSP} đã được cập nhật trong giỏ hàng!`
        );
      }
    });

    window.addEventListener("cartUpdated", handleCartUpdate);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") {
        updateCart();
      }
    });

    return () => {
      socket.off("productUpdated");
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

    const existingItemIndex = newCart.findIndex(
      (item) =>
        item.id === newCart[index].id &&
        item.memory === newMemory &&
        item !== newCart[index]
    );

    if (existingItemIndex !== -1) {
      const currentQuantity = newCart[index].quantity;
      const existingQuantity = newCart[existingItemIndex].quantity;
      const combinedQuantity = currentQuantity + existingQuantity;

      newCart[existingItemIndex].quantity = Math.min(
        combinedQuantity,
        newMaxQuantity
      );
      newCart[existingItemIndex].maxQuantity = newMaxQuantity;

      newCart.splice(index, 1);
    } else {
      const currentQuantity = newCart[index].quantity;
      const newQuantity =
        newMaxQuantity === 0
          ? 0
          : currentQuantity === 0
          ? 1
          : Math.min(currentQuantity, newMaxQuantity);

      newCart[index] = {
        ...newCart[index],
        memory: newMemory,
        price: newPrice,
        maxQuantity: newMaxQuantity,
        quantity: newQuantity,
      };
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (userId) {
      localStorage.setItem(`cart_${userId}`, JSON.stringify(newCart));
    }

    const newSelectedItems = {};
    newCart.forEach((_, i) => {
      newSelectedItems[i] = newCart[i].maxQuantity > 0;
    });
    setSelectedItems(newSelectedItems);

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

    const newSelectedItems = {};
    newCart.forEach((_, i) => {
      newSelectedItems[i] = newCart[i].maxQuantity > 0;
    });
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

    const promotion = promotions.data.find(
      (promo) => promo.MaKM === tempVoucher
    );

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

    if (total < 10000000) {
      message.error(
        "Đơn hàng giá trị tối thiểu 10 triệu để áp dụng mã giảm giá."
      );
      return;
    }

    let discountAmount = 0;
    if (promotion.LoaiKM === "percentage") {
      discountAmount = (total * promotion.GiaTriKM) / 100;
    } else {
      discountAmount = promotion.GiaTriKM;
    }

    const maxDiscount = 2000000;
    if (discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
      message.warning("Mã giảm giá chỉ áp dụng tối đa 2000,000 VND.");
    }

    setDiscount(discountAmount);
    setVoucher(tempVoucher);
    message.success("Áp dụng mã giảm giá thành công!");

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;
    if (userId) {
      localStorage.setItem(
        `voucher_${userId}`,
        JSON.stringify({ code: tempVoucher, discount: discountAmount })
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
    setTempVoucher(e.target.value);
    if (e.target.value === "") {
      setTempDiscount(0);
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

  const showVoucherModal = () => {
    setTempVoucher(voucher);
    setTempDiscount(discount);
    setIsVoucherModalVisible(true);
  };

  const handleVoucherModalOk = () => {
    applyVoucher();
    setIsVoucherModalVisible(false);
  };

  const handleVoucherModalCancel = () => {
    setTempVoucher(voucher);
    setTempDiscount(discount);
    setIsVoucherModalVisible(false);
  };

  const handleSelectVoucher = (voucherCode) => {
    setTempVoucher(voucherCode);
    const promotion = promotions.data.find(
      (promo) => promo.MaKM === voucherCode
    );
    if (promotion) {
      const total = calculateTotal();
      let discountAmount = 0;
      if (promotion.LoaiKM === "percentage") {
        discountAmount = (total * promotion.GiaTriKM) / 100;
      } else {
        discountAmount = promotion.GiaTriKM;
      }
      setTempDiscount(discountAmount);
    }
  };

  // Kiểm tra nếu có bất kỳ sản phẩm nào được chọn và còn hàng
  const hasSelectedInStockItems = Object.entries(selectedItems).some(
    ([index, isSelected]) => isSelected && cart[index]?.maxQuantity > 0
  );

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
              newSelectedItems[index] =
                e.target.checked && cart[index].maxQuantity > 0;
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
          disabled={record.maxQuantity === 0}
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
            style={{
              width: 100,
              height: 100,
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
          <div>
            <Text strong style={{ fontSize: 16 }}>
              {record.name}
            </Text>
            <div>
              <Text type="secondary">
                Bộ nhớ: {record.memory}
                <div className="d-flex gap-2 mt-2">
                  {[
                    "BoNhoTrong1",
                    "BoNhoTrong2",
                    "BoNhoTrong3",
                    "BoNhoTrong4",
                    "BoNhoTrong5",
                    "BoNhoTrong6",
                  ].map(
                    (memoryKey) =>
                      record.availableMemories[memoryKey] &&
                      record.availableMemories[memoryKey] !== "Không có" ? (
                        <div
                          key={memoryKey}
                          style={{ position: "relative", textAlign: "center" }}
                        >
                          <Button
                            type={
                              record.memory ===
                              record.availableMemories[memoryKey]
                                ? "primary"
                                : "default"
                            }
                            size="small"
                            onClick={() => handleMemoryChange(index, memoryKey)}
                          >
                            {record.availableMemories[memoryKey]}
                          </Button>
                          {record.memory ===
                            record.availableMemories[memoryKey] &&
                            record.availableMemories[
                              `SoLuong${memoryKey.slice(-1)}`
                            ] === 0 && (
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
              disabled={quantity <= 1 || record.maxQuantity === 0}
            />
            <Text>{quantity}</Text>
            <Button
              icon={<PlusOutlined />}
              onClick={() => increaseQuantity(index)}
              disabled={record.maxQuantity <= 0}
            />
          </Space>
          <Text type="secondary">Còn lại: {record.maxQuantity}</Text>
          {record.maxQuantity <= 0 && (
            <Text type="danger">Sản phẩm đã hết hàng</Text>
          )}
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
              <Title level={4}>
                Tổng tiền: {formatCurrency(calculateOriginalTotal())}
              </Title>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 16,
                }}
              >
                <Space>
                  <TagOutlined style={{ color: "#ff6200", fontSize: 20 }} />
                  <Text strong>SmartPhone Voucher</Text>
                </Space>
                <Space>
                  <Button
                    type="link"
                    onClick={hasSelectedInStockItems ? showVoucherModal : undefined}
                    disabled={!hasSelectedInStockItems}
                    style={{
                      color: hasSelectedInStockItems ? "#1890ff" : "#d9d9d9",
                      cursor: hasSelectedInStockItems ? "pointer" : "not-allowed",
                    }}
                  >
                    {voucher ? `Mã: ${voucher}` : "Chọn mã giảm giá"}
                  </Button>
                  {voucher && (
                    <Button
                      type="link"
                      danger
                      onClick={() => {
                        setVoucher("");
                        setDiscount(0);
                        const userData = JSON.parse(
                          localStorage.getItem("userData")
                        );
                        const userId = userData?.id;
                        if (userId) {
                          localStorage.removeItem(`voucher_${userId}`);
                        }
                        message.error("Bạn đã hủy sử dụng mã giảm giá.");
                      }}
                      style={{ marginLeft: 8 }}
                    >
                      ✕
                    </Button>
                  )}
                </Space>
              </div>

              {discount > 0 && (
                <Text style={{ color: "#ff4d4f", marginLeft: 30 }}>
                  Bạn được giảm {formatCurrency(discount)}
                </Text>
              )}

              {calculateFinalTotal() < calculateOriginalTotal() && (
                <Text style={{ fontSize: "19px" }} type="success" strong>
                  Tổng tiền sau giảm giá:{" "}
                  {formatCurrency(calculateFinalTotal())}
                </Text>
              )}

              {cart.some((item) => item.maxQuantity === 0) && (
                <Alert
                  message="Có sản phẩm đã hết hàng, vui lòng xóa hoặc chọn bộ nhớ khác."
                  type="warning"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}

              <Modal
                title="Chọn SmartPhone Voucher"
                visible={isVoucherModalVisible}
                onOk={handleVoucherModalOk}
                onCancel={handleVoucherModalCancel}
                okText="OK"
                cancelText="Trở lại"
                bodyStyle={{ maxHeight: "400px", overflowY: "auto" }}
              >
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Input
                    placeholder="Nhập mã giảm giá"
                    value={tempVoucher}
                    onChange={handleVoucherChange}
                    style={{ marginBottom: 16 }}
                  />
                  <Title level={2}>Giảm Giá</Title>
                  <b style={{ fontSize: "10px", color: "gray" }}>
                    Có thể chọn 1 Voucher
                  </b>
                  {promotions?.data?.length > 0 ? (
                    <Radio.Group
                      onChange={(e) => handleSelectVoucher(e.target.value)}
                      value={tempVoucher}
                      style={{ width: "100%" }}
                    >
                      <Space direction="vertical" style={{ width: "100%" }}>
                        {promotions.data
                          .map((promo) => {
                            const currentDate = new Date();
                            const startDate = new Date(promo.NgayBD);
                            const endDate = new Date(promo.NgayKT);
                            const isValid =
                              currentDate >= startDate &&
                              currentDate <= endDate &&
                              promo.TrangThai !== 1;

                            return { ...promo, isValid };
                          })
                          .sort((a, b) => {
                            if (a.isValid && !b.isValid) return -1;
                            if (!a.isValid && b.isValid) return 1;
                            return a.isValid
                              ? b.MaKM.localeCompare(a.MaKM)
                              : a.MaKM.localeCompare(b.MaKM);
                          })
                          .map((promo) => (
                            <div
                              key={promo.MaKM}
                              style={{
                                border: "1px solid #d9d9d9",
                                borderRadius: 4,
                                padding: 12,
                                marginBottom: 8,
                                backgroundColor: promo.isValid
                                  ? "#fff"
                                  : "#f5f5f5",
                              }}
                            >
                              <Radio
                                value={promo.MaKM}
                                disabled={!promo.isValid}
                              >
                                <Space direction="vertical">
                                  <Text strong>{promo.MaKM}</Text>
                                  <Text>
                                    Giảm{" "}
                                    <span style={{ color: "red" }}>
                                      {promo.LoaiKM === "percentage"
                                        ? `${promo.GiaTriKM}%`
                                        : formatCurrency(promo.GiaTriKM)}
                                    </span>{" "}
                                    {promo.MoTa}
                                  </Text>
                                  <Text type="secondary">
                                    HSD: {promo.NgayKT} <br />
                                    {promo.isValid ? (
                                      <Text type="success">Có thể sử dụng</Text>
                                    ) : (
                                      <Text type="danger">
                                        Bạn chưa đủ điều kiện sử dụng hoặc Voucher
                                        đã hết!
                                      </Text>
                                    )}
                                  </Text>
                                </Space>
                              </Radio>
                              {tempVoucher === promo.MaKM &&
                                tempDiscount > 0 && (
                                  <Text
                                    style={{ color: "#ff4d4f", marginLeft: 5 }}
                                  >
                                    Bạn được giảm {formatCurrency(tempDiscount)}
                                  </Text>
                                )}
                            </div>
                          ))}
                      </Space>
                    </Radio.Group>
                  ) : (
                    <Text>Không có mã giảm giá nào khả dụng.</Text>
                  )}
                </Space>
              </Modal>

              <Button
                type="primary"
                block
                size="large"
                onClick={handleCheckout}
                disabled={!hasSelectedInStockItems}
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