import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts } from "../../../service/api";
import { FaMobileAlt, FaCamera, FaMicrochip, FaBatteryFull, FaPlug, FaInfoCircle } from "react-icons/fa";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMemory, setSelectedMemory] = useState({ memory: "", price: 0, quantity: 0 });
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({});
  const [colorQuantities, setColorQuantities] = useState({}); // Lưu số lượng màu sắc tương ứng

  useEffect(() => {
    setLoading(true);
    getProducts(id)
      .then((response) => {
        const productData = response.data.data;
        setProduct(productData);

        if (productData.BoNhoTrong1) {
          setSelectedMemory({ memory: productData.BoNhoTrong1, price: productData.GiaSP1, quantity: productData.SoLuong1 });
          setColorQuantities({
            Mau1: productData.SoLuongMau1_1,
            Mau2: productData.SoLuongMau1_2,
            Mau3: productData.SoLuongMau1_3,
          });
        }
        if (productData.Mau1) {
          setSelectedColor(productData.Mau1);
        }
        if (productData.HinhAnh1) {
          setSelectedImage(productData.HinhAnh1);
        }

        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải chi tiết sản phẩm.");
        setLoading(false);
      });
  }, [id]);

  const handleMemorySelection = (memoryKey) => {
    const memory = product[memoryKey];
    const memoryIndex = memoryKey.slice(-1); // Lấy số cuối của key (1, 2, 3)

    setSelectedMemory({
      memory: memory,
      price: product[`GiaSP${memoryIndex}`],
      quantity: product[`SoLuong${memoryIndex}`],
    });

    // Cập nhật số lượng màu sắc tương ứng
    setColorQuantities({
      Mau1: product[`SoLuongMau${memoryIndex}_1`],
      Mau2: product[`SoLuongMau${memoryIndex}_2`],
      Mau3: product[`SoLuongMau${memoryIndex}_3`],
    });
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
      (item) => item.id === product._id && item.memory === selectedMemory.memory && item.color === selectedColor
    );
  
    // Lấy số lượng màu tương ứng với bộ nhớ và màu sắc đã chọn
    const memoryIndex = selectedMemory.memory === product.BoNhoTrong1 ? 1 : selectedMemory.memory === product.BoNhoTrong2 ? 2 : 3;
    const colorIndex = selectedColor === product.Mau1 ? 1 : selectedColor === product.Mau2 ? 2 : 3;
    const quantityKey = `SoLuongMau${memoryIndex}_${colorIndex}`;
    const maxQuantity = product[quantityKey] || 0;
  
    if (existingItemIndex !== -1) {
      if (cartItems[existingItemIndex].quantity < maxQuantity) {
        cartItems[existingItemIndex].quantity += 1;
      } else {
        alert("Số lượng sản phẩm trong giỏ hàng đã đạt tối đa.");
        return;
      }
    } else {
      cartItems.push({
        id: product._id,
        name: product.TenSP,
        memory: selectedMemory.memory,
        color: selectedColor,
        image: selectedImage,
        quantity: 1,
        price: selectedMemory.price,
        maxQuantity: maxQuantity, // Lưu số lượng màu tương ứng
      });
    }
  
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cartItems));
    alert("Sản phẩm đã được thêm vào giỏ hàng!");
  
    // Kích hoạt sự kiện "cartUpdated" để thông báo cập nhật giỏ hàng
    window.dispatchEvent(new Event("cartUpdated"));
  
    // Chuyển hướng đến trang giỏ hàng
    navigate("/cart");
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
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
  if (!product) return <div className="alert alert-warning">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Phần hình ảnh */}
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
            {[1, 2, 3].map((index) =>
              product[`HinhAnh${index}`] ? (
                <img
                  key={index}
                  src={product[`HinhAnh${index}`]}
                  alt={product.TenSP}
                  className={`img-thumbnail mx-2 ${selectedImage === product[`HinhAnh${index}`] ? "border border-primary" : ""}`}
                  width={80}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedImage(product[`HinhAnh${index}`])}
                />
              ) : null
            )}
          </div>
        </div>

        {/* Phần thông tin sản phẩm */}
        <div className="col-md-6">
          <h2>{product.TenSP}</h2>
          <p className="text-muted">Mã sản phẩm: {product.MaSP}</p>
          <h4 className="text-danger">{formatCurrency(selectedMemory.price)}</h4>
          <p>Tổng Số lượng: {selectedMemory.quantity}</p>

          {/* Hiển thị số lượng màu sắc khi chọn màu */}
          {selectedColor && (
            <div className="alert alert-info">
              Số lượng màu: {colorQuantities[`Mau${["Mau1", "Mau2", "Mau3"].findIndex((mau) => product[mau] === selectedColor) + 1}`] || 0}
            </div>
          )}

          <h5>Bộ Nhớ Trong:</h5>
          <div className="d-flex gap-2">
            {["BoNhoTrong1", "BoNhoTrong2", "BoNhoTrong3"].map((key, index) =>
              product[key] ? (
                <button
                  key={index}
                  className={`btn ${selectedMemory.memory === product[key] ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() => handleMemorySelection(key)}
                >
                  {product[key]}
                </button>
              ) : null
            )}
          </div>

          <h5 className="mt-3">Màu sắc:</h5>
          <div className="d-flex gap-2">
            {[product.Mau1, product.Mau2, product.Mau3].map((color, index) =>
              color ? (
                <div
                  key={index}
                  className={`border p-2 rounded ${selectedColor === color ? "border border-primary border-3 shadow-lg" : "border-secondary"}`}
                  style={{ 
                    width: selectedColor === color ? "50px" : "40px", // Phóng to khi chọn
                    height: selectedColor === color ? "50px" : "40px", // Phóng to khi chọn
                    backgroundColor: color, 
                    cursor: "pointer",
                    transition: "all 0.3s ease-in-out", // Thêm hiệu ứng chuyển động mượt mà
                  }}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedImage(product[`HinhAnh${index + 1}`] || product.HinhAnh1);
                  }}
                ></div>
              ) : null
            )}
          </div>

          <button className="btn btn-success mt-3" onClick={addToCart}>
            🛒 Thêm vào giỏ hàng
          </button>
        </div>

        {/* Phần thông tin chi tiết sản phẩm */}
        <div className="col-12 mt-4">
          <div className="card shadow-sm p-4 bg-light">
            <h3 className="mb-4"><FaInfoCircle className="me-2" />THÔNG TIN SẢN PHẨM</h3>
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
                    <strong>Trạng Thái:</strong> {product.TrangThai}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};

export default ProductDetail;