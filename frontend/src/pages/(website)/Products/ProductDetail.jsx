import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  createComment,
  fetchComments,
  getProducts,
  fetchProducts,
} from "../../../service/api";
import SellerProducts from "../../(website)/components/SellerProducts";
import LatestProducts from "../../(website)/components/LatestProducts";
import {
  FaTag,
  FaMobileAlt,
  FaCamera,
  FaMicrochip,
  FaBatteryFull,
  FaPlug,
  FaInfoCircle,
  FaChevronLeft,
  FaChevronRight,
  FaShoppingCart,
  FaExchangeAlt,
  FaTimes,
} from "react-icons/fa";
import { Button, Form, Input, message, Rate, Modal, Table } from "antd";

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

  const productListRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

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

  const updateArrowVisibility = () => {
    const container = productListRef.current;
    setShowLeftArrow(container.scrollLeft > 0);
    setShowRightArrow(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  useEffect(() => {
    const container = productListRef.current;
    const handleScroll = () => updateArrowVisibility();

    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

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
        if (productData.HinhAnh1) {
          setSelectedImage(productData.HinhAnh1);
        }

        setLoading(false);

        fetchProducts().then((response) => {
          const allProducts = response.data.data || [];
          setAllProducts(allProducts);
          const related = allProducts
            .filter(
              (p) =>
                p.TenSP.toLowerCase().includes(productData.TenSP.toLowerCase()) &&
                p._id !== productData._id
            )
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
        const productComments = response.data.filter(
          (comment) => comment.MaSP === id
        );
        setComments(productComments);
      } catch (error) {
        console.error("Lỗi khi tải bình luận:", error);
      }
    };

    fetchProductComments();
  }, [id]);

  const openCompareModal = () => {
    setCompareModalVisible(true);
    const availableProducts = allProducts.filter((p) => p._id !== id);
    setCompareProducts(availableProducts);
  };

  const toggleCompareProduct = (productId) => {
    setSelectedCompareProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleCompare = () => {
    if (selectedCompareProducts.length === 0) {
      message.warning("Vui lòng chọn ít nhất 1 sản phẩm để so sánh");
      return;
    }

    const productsToCompare = [
      product,
      ...compareProducts.filter((p) => selectedCompareProducts.includes(p._id)),
    ];

    const allPossibleKeys = new Set();
    productsToCompare.forEach((product) => {
      Object.keys(product).forEach((key) => {
        if (
          ![
            "_id",
            "HinhAnh1",
            "HinhAnh2",
            "HinhAnh3",
            "HinhAnh4",
            "HinhAnh5",
            "HinhAnh6",
            "TenSP",
            "GiaSP1",
            "GiaSP2",
            "GiaSP3",
            "SoLuong1",
            "SoLuong2",
            "SoLuong3",
          ].includes(key)
        ) {
          allPossibleKeys.add(key);
        }
      });
    });

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
                  <div className="text-center">
                    <img
                      src={record.HinhAnh1}
                      alt={text}
                      style={{ width: 100, height: 100, objectFit: "contain" }}
                    />
                    <div>{text}</div>
                    <div className="text-danger fw-bold">
                      {formatCurrency(record.GiaSP1)}
                    </div>
                  </div>
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
                dataIndex: "BoNhoTrong1",
                key: "storage",
                render: (text) => text || "--",
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
                title: "Mô tả",
                dataIndex: "MoTa",
                key: "battery",
                render: (text) => text || "--",
              },
              {
                title: "Cổng sạc",
                dataIndex: "CapSac",
                key: "charging",
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
    const containsForbiddenWords = checkvar.some((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return regex.test(values.NoiDung);
    });

    if (containsForbiddenWords) {
      message.error("Bình luận của bạn có chứa từ ngữ không phù hợp!");
      return;
    }
    try {
      setLoading(true);
      const commentData = {
        ...values,
        MaSP: id,
        Email: email,
      };
      await createComment(commentData);
      message.success("Bình luận đã được thêm thành công!");
      form.resetFields();

      const response = await fetchComments();
      const productComments = response.data.filter(
        (comment) => comment.MaSP === id
      );
      setComments(productComments);
    } catch (error) {
      console.error(error);
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
      memory: memory,
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
      message.warning("Vui lòng chọn bộ nhớ và màu sắc!");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (!userId) {
      message.error("Không tìm thấy thông tin người dùng.");
      return;
    }

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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.5)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({});
  };

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product)
    return <div className="alert alert-warning">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-6 text-center">
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  overflow: "hidden",
                  borderRadius: "10px",
                  position: "relative",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <img
                  src={selectedImage}
                  alt={product.TenSP}
                  className="img-fluid rounded shadow-sm"
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
              <div className="d-flex justify-content-center mt-3">
                {[1, 2, 3, 4, 5, 6].map((index) =>
                  product[`HinhAnh${index}`] ? (
                    <img
                      key={index}
                      src={product[`HinhAnh${index}`]}
                      alt={product.TenSP}
                      className={`img-thumbnail mx-2 ${
                        selectedImage === product[`HinhAnh${index}`]
                          ? "border border-primary"
                          : ""
                      }`}
                      width={80}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedImage(product[`HinhAnh${index}`])}
                    />
                  ) : null
                )}
              </div>
            </div>

            <div className="col-md-6">
              <h2>{product.TenSP}</h2>
              <p className="text-muted">Mã sản phẩm: {product.MaSP}</p>
              <h4 className="text-danger">
                {formatCurrency(selectedMemory.price)}
              </h4>
              <p
                className={
                  selectedMemory.quantity > 0 ? "text-success" : "text-danger"
                }
              >
                {selectedMemory.quantity > 0 ? "Còn hàng" : "Hết hàng"}
              </p>

              <h5>Bộ Nhớ Trong:</h5>
              <div className="d-flex gap-2 mb-3">
                {["BoNhoTrong1", "BoNhoTrong2", "BoNhoTrong3"].map(
                  (memoryKey, index) => {
                    const memoryIndex = memoryKey.slice(-1);
                    return product[memoryKey] ? (
                      <button
                        key={index}
                        className={`btn ${
                          selectedMemory.memory === product[memoryKey]
                            ? "btn-primary"
                            : "btn-outline-primary"
                        }`}
                        onClick={() => {
                          setSelectedMemory({
                            memory: product[memoryKey],
                            price: product[`GiaSP${memoryIndex}`],
                            quantity: product[`SoLuong${memoryIndex}`],
                          });
                        }}
                      >
                        {product[memoryKey]}
                        {selectedMemory.memory === product[memoryKey] && (
                          <span className="ms-1 fw-normal">
                            ({product[`SoLuong${memoryIndex}`]} sản phẩm)
                          </span>
                        )}
                      </button>
                    ) : null;
                  }
                )}
              </div>

              <h5>Màu sắc:</h5>
              <div className="d-flex gap-2 mb-3">
                {[product.Mau1, product.Mau2, product.Mau3].map(
                  (color, index) =>
                    color ? (
                      <div
                        key={index}
                        className={`border p-2 rounded ${
                          selectedColor === color
                            ? "border border-primary border-3 shadow-lg"
                            : "border-secondary"
                        }`}
                        style={{
                          width: selectedColor === color ? "50px" : "40px",
                          height: selectedColor === color ? "50px" : "40px",
                          backgroundColor:
                            color === "Hết Hàng" ? "gray" : color,
                          cursor: "pointer",
                          transition: "all 0.3s ease-in-out",
                        }}
                        onClick={() => handleColorSelection(color)}
                        title={color}
                      ></div>
                    ) : null
                )}
              </div>

              <button
                className="btn btn-info mt-3 me-2"
                onClick={openCompareModal}
              >
                <FaExchangeAlt className="me-2" />
                So sánh sản phẩm
              </button>

              <button
                className="btn btn-success mt-3"
                onClick={addToCart}
                disabled={
                  !isColorAvailable ||
                  selectedColor === "Hết Hàng" ||
                  selectedMemory.quantity <= 0
                }
              >
                <FaShoppingCart className="me-2" />
                Thêm vào giỏ hàng
              </button>

              {relatedProducts.length > 0 && (
                <div className="mt-4">
                  <h5>Các phiên bản màu sắc khác:</h5>
                  <div className="row row-cols-2 row-cols-md-4 g-3">
                    {relatedProducts.map((relatedProduct) => {
                      const nameParts = relatedProduct.TenSP.split(" ");
                      const mainName = nameParts.slice(0, 2).join(" ");
                      const subName = nameParts.slice(2).join(" ");

                      return (
                        <div key={relatedProduct._id} className="col">
                          <Link
                            to={`/products/product_detail/${relatedProduct._id}`}
                            className="text-decoration-none"
                          >
                            <div className="card h-100 border-0 shadow-sm hover-shadow transition-all">
                              <div className="ratio ratio-1x1">
                                <img
                                  src={relatedProduct.HinhAnh1}
                                  alt={relatedProduct.TenSP}
                                  className="card-img-top p-2 object-contain bg-light"
                                />
                              </div>
                              <div className="card-body text-center p-2">
                                <h6
                                  className="card-title mb-1"
                                  style={{ fontSize: "0.9rem" }}
                                >
                                  {mainName}
                                  <br />
                                  <small className="text-muted">{subName}</small>
                                </h6>
                                <p
                                  className="text-danger fw-bold mb-1"
                                  style={{ fontSize: "0.8rem" }}
                                >
                                  {formatCurrency(relatedProduct.GiaSP1)}
                                </p>
                                <p className="text-muted small mb-0">
                                  {relatedProduct.BoNhoTrong1}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-12 mt-4">
            <div className="card shadow-sm p-4 bg-light">
              <h3 className="mb-4">
                <FaInfoCircle className="me-2" />
                THÔNG TIN CHI TIẾT SẢN PHẨM
              </h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <FaMicrochip className="me-3 fs-5" />
                    <div>
                      <strong>Hệ điều hành:</strong> {product.HDH}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaCamera className="me-3 fs-5" />
                    <div>
                      <strong>Camera sau:</strong> {product.CamSau}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaCamera className="me-3 fs-5" />
                    <div>
                      <strong>Camera trước:</strong> {product.CamTruoc}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaMobileAlt className="me-3 fs-5" />
                    <div>
                      <strong>Màn hình:</strong> {product.ManHinh}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <FaMicrochip className="me-3 fs-5" />
                    <div>
                      <strong>Chip xử lý:</strong> {product.CPU}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaPlug className="me-3 fs-5" />
                    <div>
                      <strong>Cổng sạc:</strong> {product.CapSac}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaBatteryFull className="me-3 fs-5" />
                    <div>
                      <strong>Loại pin:</strong> {product.LoaiPin}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaTag className="me-3 fs-5" />
                    <div>
                      <strong>Mô tả:</strong> {product.MoTa}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Chọn sản phẩm để so sánh"
        visible={compareModalVisible}
        onOk={handleCompare}
        onCancel={() => {
          setCompareModalVisible(false);
          setSelectedCompareProducts([]);
        }}
        okText="So sánh"
        cancelText="Hủy"
        width={800}
      >
        <div className="row">
          {compareProducts.map((product) => (
            <div key={product._id} className="col-md-4 mb-3">
              <div
                className={`card h-100 cursor-pointer ${
                  selectedCompareProducts.includes(product._id)
                    ? "border-primary border-2 shadow"
                    : "border-light"
                }`}
                onClick={() => toggleCompareProduct(product._id)}
              >
                <div className="card-body text-center">
                  <img
                    src={product.HinhAnh1}
                    alt={product.TenSP}
                    className="img-fluid mb-2"
                    style={{ height: "100px", objectFit: "contain" }}
                  />
                  <h6 className="card-title">{product.TenSP}</h6>
                  <p className="text-danger fw-bold">
                    {formatCurrency(product.GiaSP1)}
                  </p>
                  <p className="text-muted small">{product.BoNhoTrong1}</p>
                  {selectedCompareProducts.includes(product._id) && (
                    <div className="position-absolute top-0 end-0 m-2 bg-primary text-white rounded-circle p-1">
                      <FaTimes />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {allProducts.length > 0 && (
        <div className="row mt-5 position-relative">
          <div className="col-12">
            <h3 className="mb-4">Tất cả sản phẩm</h3>
            <div className="position-relative">
              {showLeftArrow && (
                <button
                  className="position-absolute start-0 top-50 translate-middle-y btn btn-light rounded-circle shadow border-0"
                  onClick={() => scrollProducts("left")}
                  style={{
                    zIndex: 1,
                    left: "-15px",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <FaChevronLeft className="text-dark" />
                </button>
              )}

              <div
                ref={productListRef}
                className="d-flex overflow-auto pb-3 scrollbar-hidden"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  scrollBehavior: "smooth",
                }}
              >
                <div className="d-flex flex-nowrap gap-3 px-2">
                  {allProducts.map((product) => (
                    <div
                      key={product._id}
                      style={{ minWidth: "250px", maxWidth: "250px" }}
                    >
                      <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
                        <Link to={`/products/product_detail/${product._id}`}>
                          <div className="ratio ratio-1x1">
                            <img
                              src={product.HinhAnh1}
                              alt={product.TenSP}
                              className="card-img-top p-3 object-contain bg-white"
                            />
                          </div>
                          <div className="card-body text-center">
                            <h6 className="card-title text-truncate">
                              {product.TenSP}
                            </h6>
                            <p className="text-danger fw-bold mb-1">
                              {formatCurrency(product.GiaSP1)}
                            </p>
                            <p className="text-muted small mb-0">
                              {product.BoNhoTrong1}
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {showRightArrow && (
                <button
                  className="position-absolute end-0 top-50 translate-middle-y btn btn-light rounded-circle shadow border-0"
                  onClick={() => scrollProducts("right")}
                  style={{
                    zIndex: 1,
                    right: "-15px",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <FaChevronRight className="text-dark" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-12 mt-4">
          <LatestProducts />
        </div>
        <div className="col-12 mt-4">
          <SellerProducts />
        </div>

        <div className="col-12 mt-4">
          <div className="card shadow-sm p-4 bg-light">
            <h3 className="mb-4">
              <FaInfoCircle className="me-2" />
              ĐÁNH GIÁ SẢN PHẨM
            </h3>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                name="NoiDung"
                label="Nội dung đánh giá"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung đánh giá" },
                ]}
              >
                <Input.TextArea
                  placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                  rows={4}
                />
              </Form.Item>

              <Form.Item
                name="DanhGia"
                label="Xếp hạng"
                rules={[
                  { required: true, message: "Vui lòng chọn số sao đánh giá" },
                ]}
              >
                <Rate allowHalf />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                >
                  Gửi đánh giá
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="card shadow-sm p-4 bg-light">
            <h3 className="mb-4">
              <FaInfoCircle className="me-2" />
              ĐÁNH GIÁ TỪ KHÁCH HÀNG
            </h3>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className="mb-4 pb-3 border-bottom">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <strong className="text-primary">{comment.Email}</strong>
                    <span className="text-muted small">
                      {new Date(comment.NgayBL).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <Rate
                    disabled
                    defaultValue={parseInt(comment.DanhGia)}
                    className="mb-2"
                  />
                  <p className="mb-0">{comment.NoiDung}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-muted">
                  Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá sản phẩm
                  này!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const style = document.createElement("style");
style.innerHTML = `
  .compare-table-container {
    max-height: 70vh;
    overflow-y: auto;
  }
  .scrollbar-hidden::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

export default ProductDetail;