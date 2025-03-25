import React, { useState, useEffect } from "react";
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
  FaMobileAlt,
  FaCamera,
  FaMicrochip,
  FaBatteryFull,
  FaPlug,
  FaInfoCircle,
} from "react-icons/fa";
import { Button, Form, Input, message, Rate } from "antd";

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
  const [form] = Form.useForm();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const email = userData?.Email;
  const checkvar = ["vc", "vl", "lồn", "cặc", "cc", "độc hại"];
  const [displayedComments, setDisplayedComments] = useState(5);

  const handleShowMore = () => {
    setDisplayedComments(comments.length); // Hiển thị tất cả bình luận
  };

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
      alert("Màu này đã hết hàng!");
    } else {
      setIsColorAvailable(true);
    }
    setSelectedColor(color);
  };

  const addToCart = () => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate("/login");
      return;
    }

    if (!product || !selectedMemory.memory || !selectedColor) {
      alert("Vui lòng chọn bộ nhớ và màu sắc!");
      return;
    }

    const userData = JSON.parse(localStorage.getItem("userData"));
    const userId = userData?.id;

    if (!userId) {
      alert("Không tìm thấy thông tin người dùng.");
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
        alert("Đã đạt đến giới hạn sản phẩm.");
        return;
      }
      cartItems[existingItemIndex].quantity = newQuantity;
    } else {
      if (1 > selectedMemory.quantity) {
        alert("Sản phẩm đã hết.");
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
    alert("Sản phẩm đã được thêm vào giỏ hàng!");

    window.dispatchEvent(new Event("cartUpdated"));

    navigate("/cart");
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
        {/* Phần thông tin chi tiết sản phẩm */}
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
                {[1, 2, 3, 4 ,5 ,6].map((index) =>
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
              <p>Số lượng: {selectedMemory.quantity}</p>
              {/* Phần Bộ Nhớ Trong */}
              <h5>Bộ Nhớ Trong:</h5>
              <div className="d-flex gap-2">
                {["BoNhoTrong1", "BoNhoTrong2", "BoNhoTrong3"].map((key, index) =>
                  product[key] ? (
                    <button
                      key={index}
                      className={`btn ${
                        selectedMemory.memory === product[key]
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => handleMemorySelection(key)}
                    >
                      {product[key]}
                    </button>
                  ) : null
                )}
              </div>

              <div className="d-flex align-items-center gap-2 mt-3">
  <h5 className="mb-0">Màu sắc:</h5>
  <div className="d-flex gap-2">
    {[product.Mau1, product.Mau2, product.Mau3].map((color, index) =>
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
            backgroundColor: color === "Hết Hàng" ? "gray" : color,
            cursor: "pointer",
            transition: "all 0.3s ease-in-out",
          }}
          onClick={() => handleColorSelection(color)}
        ></div>
      ) : null
    )}
  </div>
</div>


              {/* Phần "Các Màu Khác" */}
              <div className="mt-4">
  <h5>Các Màu Khác:</h5>
  <div className="row row-cols-2 row-cols-md-4 g-3">
    {relatedProducts.slice(0, 4).map((relatedProduct) => (
      <div key={relatedProduct._id} className="col">
        <div
          className="card h-100"
          style={{
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            overflow: "hidden",
            transition: "transform 0.2s, box-shadow 0.2s",
            aspectRatio: "1 / 1", // Đảm bảo tỷ lệ khung hình vuông
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          <Link to={`/products/product_detail/${relatedProduct._id}`}>
            <img
              src={relatedProduct.HinhAnh1}
              alt={relatedProduct.TenSP}
              className="card-img-top"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover", // Đảm bảo hình ảnh phủ kín khung hình vuông
                aspectRatio: "1 / 1", // Đảm bảo tỷ lệ khung hình vuông
              }}
            />
          </Link>
          <div
            className="card-body"
            style={{
              padding: "10px",
              textAlign: "center",
            }}
          >
            <h6
              className="card-title"
              style={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                marginBottom: "5px",
                color: "#333",
              }}
            >
              {relatedProduct.TenSP}
            </h6>
            <p
              className="card-text"
              style={{
                fontSize: "0.8rem",
                color: "#e74c3c",
                fontWeight: "bold",
              }}
            >
              {formatCurrency(relatedProduct.GiaSP1)}
            </p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

              {/* Nút Thêm vào giỏ hàng */}
              <button
                className="btn btn-success mt-3"
                onClick={addToCart}
                disabled={!isColorAvailable || selectedColor === "Hết Hàng"}
              >
                🛒 Thêm vào giỏ hàng
              </button>
            </div>
          </div>

          {/* Thông tin chi tiết sản phẩm */}
          <div className="col-12 mt-4">
            <div className="card shadow-sm p-4 bg-light">
              <h3 className="mb-4">
                <FaInfoCircle className="me-2" /> <br />
                THÔNG TIN SẢN PHẨM
              </h3>
              <div className="row">
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <FaMobileAlt className="me-3" />
                    <div>
                      <strong>Hệ Điều Hành:</strong> {product.HDH}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaCamera className="me-3" />
                    <div>
                      <strong>Camera Sau:</strong> {product.CamSau}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaCamera className="me-3" />
                    <div>
                      <strong>Camera Trước:</strong> {product.CamTruoc} 
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center mb-3">
                    <FaMicrochip className="me-3" />
                    <div>
                      <strong>CPU:</strong> {product.CPU}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaPlug className="me-3" />
                    <div>
                      <strong>Cáp sạc:</strong> {product.CapSac}
                    </div>
                  </div>
                  <div className="d-flex align-items-center mb-3">
                    <FaBatteryFull className="me-3" />
                    <div>
                      <strong>Mô Tả:</strong> {product.MoTa}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Các phần khác (bình luận, sản phẩm mới, v.v.) */}
      <div className="row">
        <div className="col-12 mt-4">
          <LatestProducts />
        </div>
        <div className="col-12 mt-4">
          <SellerProducts />
        </div>

        {/* phnaaf comment*/}
        <div className="col-12 mt-4">
          <div className="card shadow-sm p-4 bg-light">
            <h3 className="mb-4">
              <FaInfoCircle className="me-2" /> <br />
              BÌNH LUẬN SẢN PHẨM
            </h3>
            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                name="NoiDung"
                label="Nội Dung"
                rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
              >
                <Input.TextArea
                  placeholder="Nhập nội dung bình luận"
                  rows={4}
                />
              </Form.Item>

              <Form.Item
                name="DanhGia"
                label="Đánh Giá"
                rules={[{ required: true, message: "Vui lòng chọn đánh giá" }]}
              >
                <Rate />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Gửi Bình Luận
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>

        {/* Hiển thị danh sách bình luận */}
        <div className="col-12 mt-4">
          <div className="card shadow-sm p-4 bg-light">
            <h3 className="mb-4">
              <FaInfoCircle className="me-2" /> <br />
              BÌNH LUẬN ĐÃ CÓ
            </h3>
            {comments.length > 0 ? (
              comments.slice(0, displayedComments).map((comment, index) => (
                <div key={index} className="mb-3">
                  <p>
                    <strong>{comment.Email}</strong> -{" "}
                    <Rate disabled defaultValue={parseInt(comment.DanhGia)} />
                  </p>
                  <p>{comment.NoiDung}</p>
                  <p className="text-muted">
                    {new Date(comment.NgayBL).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
            {displayedComments < comments.length && (
              <button onClick={handleShowMore} className="btn btn-link mt-3">
                <Button>Hiển thị thêm bình luận</Button>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;