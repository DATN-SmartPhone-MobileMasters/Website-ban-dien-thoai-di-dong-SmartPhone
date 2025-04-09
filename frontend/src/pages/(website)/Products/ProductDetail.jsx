import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  createComment,
  fetchComments,
  getProducts,
  fetchProducts,
} from "../../../service/api";
import SellerProducts from "../../(website)/components/SellerProducts";
import LatestProducts from "../../(website)/components/LatestProducts";
import {
  FaShoppingCart,
  FaExchangeAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Table,
  Card,
  Row,
  Col,
  Descriptions,
  Space,
  Divider,
  Typography,
  Badge,
  Tag,
  Flex,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState({
    memory: "",
    price: 0,
    quantity: 0,
  });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({});
  const [isColorAvailable, setIsColorAvailable] = useState(true);
  const [comments, setComments] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [form] = Form.useForm();
  const [compareModalVisible, setCompareModalVisible] = useState(false);
  const [compareProducts, setCompareProducts] = useState([]);
  const [selectedCompareProducts, setSelectedCompareProducts] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const email = userData?.Email;
  const checkvar = ["vc", "vl", "lồn", "cặc", "cc", "độc hại"];
  const [displayedComments, setDisplayedComments] = useState(5);

  const handleShowMore = () => {
    setDisplayedComments(comments.length);
  };

  const productListRef = useRef(null);
  const relatedProductsRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [showRelatedLeftArrow, setShowRelatedLeftArrow] = useState(false);
  const [showRelatedRightArrow, setShowRelatedRightArrow] = useState(false);

  const scrollProducts = (direction) => {
    const container = productListRef.current;
    const scrollAmount = 300;
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
    updateArrowVisibility();
  };

  const scrollRelatedProducts = (direction) => {
    const container = relatedProductsRef.current;
    const scrollAmount = 200;
    if (direction === "left") {
      container.scrollLeft -= scrollAmount;
    } else {
      container.scrollLeft += scrollAmount;
    }
    updateRelatedArrowVisibility();
  };

  const updateArrowVisibility = () => {
    const container = productListRef.current;
    if (container) {
      setShowLeftArrow(container.scrollLeft > 0);
      setShowRightArrow(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const updateRelatedArrowVisibility = () => {
    const container = relatedProductsRef.current;
    if (container) {
      const isOverflowing = container.scrollWidth > container.clientWidth;
      setShowRelatedLeftArrow(isOverflowing && container.scrollLeft > 0);
      setShowRelatedRightArrow(
        isOverflowing &&
          container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  useEffect(() => {
    const container = productListRef.current;
    const handleScroll = () => updateArrowVisibility();
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const container = relatedProductsRef.current;
    const handleScroll = () => updateRelatedArrowVisibility();

    const checkOverflow = () => {
      if (container) {
        const isOverflowing = container.scrollWidth > container.clientWidth;
        setShowRelatedLeftArrow(isOverflowing && container.scrollLeft > 0);
        setShowRelatedRightArrow(
          isOverflowing &&
            container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      }
    };

    container?.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkOverflow);
    checkOverflow();

    return () => {
      container?.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkOverflow);
    };
  }, [relatedProducts]);

  useEffect(() => {
    setLoading(true);
    getProducts(id)
      .then((response) => {
        const productData = response.data.data;
        setProduct(productData);
        if (productData.BoNhoTrong1) {
          setSelectedMemory({
            memory: productData.BoNhoTrong1,
            price: productData.GiaSP1,
            quantity: productData.SoLuong1,
          });
        }
        if (productData.HinhAnh1) setSelectedImage(productData.HinhAnh1);
        setLoading(false);

        fetchProducts().then((response) => {
          const allProducts = response.data.data || [];
          setAllProducts(allProducts);

          const productNameParts = productData.TenSP.split("|").map((part) =>
            part.trim()
          );
          const mainProductName = productNameParts[0];
          const related = allProducts
            .filter((p) => {
              const relatedNameParts = p.TenSP.split("|").map((part) =>
                part.trim()
              );
              const relatedMainName = relatedNameParts[0];
              return (
                relatedMainName === mainProductName && p._id !== productData._id
              );
            })
            .slice(0, 4);
          setRelatedProducts(related);
        });
      })
      .catch(() => {
        setError("Không thể tải chi tiết sản phẩm.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchProductComments = async () => {
      try {
        const response = await fetchComments();
        const productComments = response.data
          .filter((comment) => comment.MaSP === id && comment.isApproved)
          .sort((a, b) => new Date(b.NgayBL) - new Date(a.NgayBL));
        setComments(productComments);
      } catch (error) {
        console.error("Lỗi khi tải bình luận:", error);
      }
    };
    fetchProductComments();

    const handleCommentUpdate = () => fetchProductComments();
    window.addEventListener("commentUpdated", handleCommentUpdate);
    return () =>
      window.removeEventListener("commentUpdated", handleCommentUpdate);
  }, [id]);

  const openCompareModal = () => {
    setCompareModalVisible(true);
    const availableProducts = allProducts.filter((p) => p._id !== id);
    setCompareProducts(availableProducts);
  };

  const toggleCompareProduct = (productId) => {
    setSelectedCompareProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleCompare = () => {
    if (selectedCompareProducts.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm để so sánh");
      return;
    }

    const updatedProduct = {
      ...product,
      BoNhoTrong1: selectedMemory.memory || product.BoNhoTrong1,
      GiaSP1: selectedMemory.price || product.GiaSP1,
    };

    const productsToCompare = [
      updatedProduct,
      ...compareProducts.filter((p) => selectedCompareProducts.includes(p._id)),
    ];

    Modal.info({
      title: "Kết quả so sánh sản phẩm",
      width: "90%",
      content: (
        <div className="compare-table-container">
          <Table
            dataSource={productsToCompare}
            columns={[
              {
                title: "Sản phẩm",
                dataIndex: "TenSP",
                key: "name",
                render: (text, record) => (
                  <Space direction="vertical" align="center">
                    <img
                      src={record.HinhAnh1}
                      alt={text}
                      style={{ width: 100, height: 100, objectFit: "contain" }}
                    />
                    <Text strong>{text}</Text>
                    <Text type="danger">{formatCurrency(record.GiaSP1)}</Text>
                  </Space>
                ),
                fixed: "left",
                width: 200,
              },
              {
                title: "Hệ điều hành",
                dataIndex: "HDH",
                key: "os",
                render: (text) => text || "--",
              },
              {
                title: "Chip xử lý",
                dataIndex: "CPU",
                key: "cpu",
                render: (text) => text || "--",
              },
              {
                title: "Bộ nhớ trong",
                key: "storage",
                render: (text, record) => record.BoNhoTrong1 || "--",
              },
              {
                title: "Camera sau",
                dataIndex: "CamSau",
                key: "rearCamera",
                render: (text) => text || "--",
              },
              {
                title: "Camera trước",
                dataIndex: "CamTruoc",
                key: "frontCamera",
                render: (text) => text || "--",
              },
              {
                title: "Cổng sạc",
                dataIndex: "CapSac",
                key: "charging",
                render: (text) => text || "--",
              },
              {
                title: "Mô tả",
                dataIndex: "MoTa",
                key: "battery",
                render: (text) => text || "--",
              },
            ]}
            bordered
            size="middle"
            scroll={{ x: true }}
            pagination={false}
          />
        </div>
      ),
      onOk() {},
    });

    setCompareModalVisible(false);
    setSelectedCompareProducts([]);
  };

  const onFinish = async (values) => {
    const containsForbiddenWords = checkvar.some((word) =>
      new RegExp(`\\b${word}\\b`, "i").test(values.NoiDung)
    );
  
    if (containsForbiddenWords) {
      message.error("Bình luận của bạn có chứa từ ngữ không phù hợp!");
      return;
    }
    try {
      setLoading(true);
      const commentData = { ...values, MaSP: id, Email: email, DanhGia: 0 };
      await createComment(commentData);
      message.success("Bình luận đã được gửi, đang chờ duyệt!");
      form.resetFields();
  
      const response = await fetchComments();
      const productComments = response.data
        .filter((comment) => comment.MaSP === id && comment.isApproved)
        .sort((a, b) => new Date(b.NgayBL) - new Date(a.NgayBL));
      setComments(productComments);
    } catch (error) {
      console.log(error.response);
      message.error(
        "Thêm bình luận thất bại! Bạn vui lòng đăng nhập để sử dụng tính năng này."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleMemorySelection = (memoryKey) => {
    const memory = product[memoryKey];
    const memoryIndex = memoryKey.slice(-1);
    setSelectedMemory({
      memory,
      price: product[`GiaSP${memoryIndex}`],
      quantity: product[`SoLuong${memoryIndex}`],
    });
  };

  const handleColorSelection = (color) => {
    if (color === "Hết Hàng") {
      setIsColorAvailable(false);
      message.warning("Màu này đã hết hàng!");
    } else {
      setIsColorAvailable(true);
    }
    setSelectedColor(color);
  };

  const addToCart = () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      message.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate("/login");
      return;
    }

    if (!product || !selectedMemory.memory || !selectedColor) {
      message.warning("Vui lòng chọn màu sắc!");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;
    const cartItems = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    const existingItemIndex = cartItems.findIndex(
      (item) =>
        item.id === product._id &&
        item.memory === selectedMemory.memory &&
        item.color === selectedColor
    );

    if (existingItemIndex !== -1) {
      const newQuantity = cartItems[existingItemIndex].quantity + 1;
      if (newQuantity > cartItems[existingItemIndex].totalQuantity) {
        message.warning("Đã đạt đến giới hạn sản phẩm.");
        return;
      }
      cartItems[existingItemIndex].quantity = newQuantity;
    } else {
      if (1 > selectedMemory.quantity) {
        message.warning("Sản phẩm đã hết.");
        return;
      }
      cartItems.push({
        id: product._id,
        name: product.TenSP,
        memory: selectedMemory.memory,
        color: selectedColor,
        image: selectedImage,
        quantity: 1,
        price: selectedMemory.price,
        maxQuantity: selectedMemory.quantity,
        totalQuantity: selectedMemory.quantity,
      });
    }

    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    message.success("Sản phẩm đã được thêm vào giỏ hàng!");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.5)",
    });
  };

  const handleMouseLeave = () => setZoomStyle({});

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product)
    return <div className="alert alert-warning">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="container mt-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card
            cover={
              <div
                style={{
                  height: 400,
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={selectedImage}
                  alt={product.TenSP}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transition: "transform 0.2s ease-in-out",
                    ...zoomStyle,
                  }}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            }
          >
            <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
              {[1, 2, 3, 4, 5, 6].map((index) =>
                product[`HinhAnh${index}`] ? (
                  <Col key={index} span={4}>
                    <img
                      src={product[`HinhAnh${index}`]}
                      alt={product.TenSP}
                      style={{
                        width: "100%",
                        height: 80,
                        objectFit: "contain",
                        cursor: "pointer",
                        border:
                          selectedImage === product[`HinhAnh${index}`]
                            ? "2px solid #1890ff"
                            : "1px solid #e8e8e8",
                        borderRadius: 4,
                      }}
                      onClick={() =>
                        setSelectedImage(product[`HinhAnh${index}`])
                      }
                    />
                  </Col>
                ) : null
              )}
            </Row>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card style={{ padding: 16 }}>
            <Flex vertical>
              <Title level={2}>{product.TenSP}</Title>
              <Text type="secondary">Mã sản phẩm: {product.MaSP}</Text>
              <Text type="secondary">Thương hiệu: {product.TenTH}</Text>
              <Title level={3} type="danger">
                {formatCurrency(selectedMemory.price)}
              </Title>
              <Badge
                status={selectedMemory.quantity > 0 ? "success" : "error"}
                text={selectedMemory.quantity > 0 ? "Còn hàng" : "Hết hàng"}
              />

              <Divider orientation="left">Bộ nhớ trong</Divider>
              <Space wrap justify="center">
                {["BoNhoTrong1", "BoNhoTrong2", "BoNhoTrong3"].map(
                  (memoryKey, index) =>
                    product[memoryKey] ? (
                      <Button
                        key={index}
                        type={
                          selectedMemory.memory === product[memoryKey]
                            ? "primary"
                            : "default"
                        }
                        onClick={() => handleMemorySelection(memoryKey)}
                      >
                        {product[memoryKey]}
                        {selectedMemory.memory === product[memoryKey] && (
                          <span>
                            {" "}
                            ({product[`SoLuong${memoryKey.slice(-1)}`]})
                          </span>
                        )}
                      </Button>
                    ) : null
                )}
              </Space>

              <Divider orientation="left">Màu sắc</Divider>
              <Space wrap justify="center">
                {[product.Mau1, product.Mau2, product.Mau3].map(
                  (color, index) =>
                    color ? (
                      <Tag
                        key={index}
                        color={color === "Hết Hàng" ? "gray" : "blue"}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          cursor: "pointer",
                          backgroundColor:
                            color !== "Hết Hàng" ? color : "gray",
                          border:
                            selectedColor === color
                              ? "2px solid #1890ff"
                              : "none",
                        }}
                        onClick={() => handleColorSelection(color)}
                      />
                    ) : null
                )}
              </Space>

              <Space style={{ marginTop: 16 }} size="large">
                <Button
                  type="primary"
                  icon={<FaShoppingCart />}
                  onClick={addToCart}
                  disabled={
                    !isColorAvailable ||
                    selectedColor === "Hết Hàng" ||
                    selectedMemory.quantity <= 0
                  }
                >
                  Thêm vào giỏ hàng
                </Button>
                <Button icon={<FaExchangeAlt />} onClick={openCompareModal}>
                  So sánh sản phẩm
                </Button>
              </Space>

              {relatedProducts.length > 0 && (
                <>
                  <Divider orientation="left">Phiên bản khác</Divider>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    {showRelatedLeftArrow && (
                      <Button
                        shape="circle"
                        icon={<FaChevronLeft />}
                        onClick={() => scrollRelatedProducts("left")}
                        style={{
                          position: "absolute",
                          left: -20,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 1,
                        }}
                      />
                    )}
                    <div
                      ref={relatedProductsRef}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        overflowX: "auto",
                        scrollBehavior: "smooth",
                        paddingBottom: 16,
                        gap: "16px",
                      }}
                      className="scrollbar-hidden"
                    >
                      {relatedProducts.map((relatedProduct) => (
                        <Card
                          key={relatedProduct._id}
                          hoverable
                          style={{
                            minWidth: 200,
                            width: 200,
                            borderRadius: 8,
                            transition:
                              "transform 0.3s ease, box-shadow 0.3s ease",
                          }}
                          cover={
                            <div
                              style={{
                                height: 150,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "#f5f5f5",
                              }}
                            >
                              <img
                                alt={relatedProduct.TenSP}
                                src={relatedProduct.HinhAnh1}
                                style={{
                                  maxHeight: "100%",
                                  maxWidth: "100%",
                                  objectFit: "contain",
                                }}
                              />
                            </div>
                          }
                          onClick={() =>
                            navigate(
                              `/products/product_detail/${relatedProduct._id}`
                            )
                          }
                        >
                          <Card.Meta
                            title={
                              <Text
                                strong
                                style={{
                                  fontSize: "14px",
                                  whiteSpace: "normal",
                                  lineHeight: "1.4",
                                }}
                              >
                                {relatedProduct.TenSP}
                              </Text>
                            }
                            description={
                              <Space direction="vertical" size={4}>
                                <Text type="danger" strong>
                                  {formatCurrency(relatedProduct.GiaSP1)}
                                </Text>
                                <Text style={{ fontSize: "12px" }}>
                                  {relatedProduct.BoNhoTrong1}
                                </Text>
                                <Badge
                                  status={
                                    relatedProduct.SoLuong1 > 0
                                      ? "success"
                                      : "error"
                                  }
                                  text={
                                    relatedProduct.SoLuong1 > 0
                                      ? "Còn hàng"
                                      : "Hết hàng"
                                  }
                                  style={{ fontSize: "12px" }}
                                />
                              </Space>
                            }
                          />
                        </Card>
                      ))}
                    </div>
                    {showRelatedRightArrow && (
                      <Button
                        shape="circle"
                        icon={<FaChevronRight />}
                        onClick={() => scrollRelatedProducts("right")}
                        style={{
                          position: "absolute",
                          right: -20,
                          top: "50%",
                          transform: "translateY(-50%)",
                          zIndex: 1,
                        }}
                      />
                    )}
                  </div>
                </>
              )}
            </Flex>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title={<Title level={4}>Thông tin chi tiết sản phẩm</Title>}>
            <Descriptions
              bordered
              column={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              labelStyle={{
                width: "220px",
                whiteSpace: "nowrap",
                padding: "8px",
                textAlign: "left",
              }}
              contentStyle={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                padding: "8px",
              }}
            >
              <Descriptions.Item label="Hệ điều hành">
                {product.HDH || "Không có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Chip xử lý">
                {product.CPU || "Không có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Camera sau">
                {product.CamSau || "Không có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Camera trước">
                {product.CamTruoc || "Không có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Màn hình">
                {product.ManHinh || "Không có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Cổng sạc">
                {product.CapSac || "Không có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Loại pin">
                {product.LoaiPin || "Không có thông tin"}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col span={24}>
          <Card title={<Title level={4}>Mô tả sản phẩm</Title>}>
            <Paragraph style={{ whiteSpace: "pre-line", textAlign: "justify" }}>
              {product.MoTa || "Không có thông tin"}
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Chọn sản phẩm để so sánh"
        visible={compareModalVisible}
        onOk={handleCompare}
        onCancel={() => setCompareModalVisible(false)}
        okText="So sánh"
        cancelText="Hủy"
        width={800}
      >
        <Row gutter={[16, 16]}>
          {compareProducts.map((product) => (
            <Col key={product._id} xs={12} sm={8}>
              <Card
                hoverable
                onClick={() => toggleCompareProduct(product._id)}
                style={{
                  border: selectedCompareProducts.includes(product._id)
                    ? "2px solid #1890ff"
                    : "1px solid #e8e8e8",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                cover={
                  <div
                    style={{
                      height: 150,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      alt={product.TenSP}
                      src={product.HinhAnh1}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                }
              >
                <Card.Meta
                  title={product.TenSP}
                  description={
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Text type="danger">
                        {formatCurrency(product.GiaSP1)}
                      </Text>
                      <Text>{product.BoNhoTrong1}</Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>

      {allProducts.length > 0 && (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card title={<Title level={4}>Tất cả sản phẩm</Title>}>
              <div style={{ position: "relative" }}>
                {showLeftArrow && (
                  <Button
                    shape="circle"
                    icon={<FaChevronLeft />}
                    onClick={() => scrollProducts("left")}
                    style={{ position: "absolute", left: -20, top: "50%" }}
                  />
                )}
                <div
                  ref={productListRef}
                  style={{
                    display: "flex",
                    overflowX: "auto",
                    scrollBehavior: "smooth",
                    paddingBottom: 16,
                  }}
                  className="scrollbar-hidden"
                >
                  {allProducts.map((product) => (
                    <Card
                      key={product._id}
                      hoverable
                      style={{ minWidth: 250, marginRight: 16 }}
                      cover={<img alt={product.TenSP} src={product.HinhAnh1} />}
                      onClick={() =>
                        navigate(`/products/product_detail/${product._id}`)
                      }
                    >
                      <Card.Meta
                        title={product.TenSP}
                        description={
                          <>
                            <Text type="danger">
                              {formatCurrency(product.GiaSP1)}
                            </Text>
                            <br />
                            <Text>{product.BoNhoTrong1}</Text>
                          </>
                        }
                      />
                    </Card>
                  ))}
                </div>
                {showRightArrow && (
                  <Button
                    shape="circle"
                    icon={<FaChevronRight />}
                    onClick={() => scrollProducts("right")}
                    style={{ position: "absolute", right: -20, top: "50%" }}
                  />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      )}

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <LatestProducts />
        </Col>
        <Col span={24}>
          <SellerProducts />
        </Col>
        <Col span={24}>
          <Card title={<Title level={4}>Bình Luận</Title>}>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                name="NoiDung"
                label="Nội dung bình luận"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập nội dung bình luận",
                  },
                ]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Viết nội dung"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Gửi bình luận
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={24}>
          <Card title={<Title level={4}>Đánh giá từ khách hàng</Title>}>
            {comments.length > 0 ? (
              comments.slice(0, displayedComments).map((comment, index) => (
                <div key={index} style={{ marginBottom: 16 }}>
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <Space>
                      <Text strong>{comment.Email}</Text>
                      <Text type="secondary">
                        {new Date(comment.NgayBL).toLocaleDateString("vi-VN")}
                      </Text>
                    </Space>
                    <Paragraph>{comment.NoiDung}</Paragraph>
                    {comment.Reply && (
                      <div
                        style={{
                          backgroundColor: "#f5f5f5",
                          padding: "8px",
                          borderRadius: "4px",
                          marginTop: "8px",
                        }}
                      >
                        <Space direction="vertical">
                          <Space>
                            <Text strong style={{ color: "#1890ff" }}>
                              {comment.Reply.AdminEmail} (Admin)
                            </Text>
                            <Text type="secondary">
                              {new Date(comment.Reply.Date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </Text>
                          </Space>
                          <Paragraph>{comment.Reply.Content}</Paragraph>
                        </Space>
                      </div>
                    )}
                  </Space>
                  <Divider />
                </div>
              ))
            ) : (
              <Text type="secondary">Chưa có đánh giá nào được duyệt.</Text>
            )}
            {comments.length > displayedComments && (
              <Button type="link" onClick={handleShowMore}>
                Xem thêm đánh giá
              </Button>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const style = document.createElement("style");
style.innerHTML = `
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .ant-card-hoverable:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;
document.head.appendChild(style);

export default ProductDetail;