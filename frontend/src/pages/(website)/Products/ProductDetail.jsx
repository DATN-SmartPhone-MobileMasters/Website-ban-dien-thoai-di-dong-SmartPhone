import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../../../service/api";

const ProductDetail = () => {
  const { id } = useParams();
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.target.style.transformOrigin = `${x}% ${y}%`;
    e.target.style.transform = "scale(2)";
  };

  const handleMouseLeave = (e) => {
    e.target.style.transform = "scale(1)";
  };

  if (loading) return <div className="text-center mt-5">Đang tải...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return <div className="alert alert-warning">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 text-center">
          <div style={{ width: "400px", height: "400px", overflow: "hidden", borderRadius: "10px" }}>
            <img
              src={selectedImage}
              alt={product.TenSP}
              className="img-fluid rounded shadow-sm"
              style={{ width: "100%", height: "100%", objectFit: "contain", transition: "transform 0.3s ease-in-out" }}
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

        <div className="col-md-6">
          <h2>{product.TenSP}</h2>
          <p className="text-muted">Mã sản phẩm: {product.MaSP}</p>
          <h4 className="text-danger">{formatCurrency(selectedMemory.price)}</h4>
          <p>Số lượng: {selectedMemory.quantity}</p>

          <h5>Bộ Nhớ Trong:</h5>
          <div className="d-flex gap-2">
            {["BoNhoTrong1", "BoNhoTrong2", "BoNhoTrong3"].map((key, index) =>
              product[key] ? (
                <button
                  key={index}
                  className={`btn ${selectedMemory.memory === product[key] ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={() =>
                    setSelectedMemory({
                      memory: product[key],
                      price: product[`GiaSP${index + 1}`],
                      quantity: product[`SoLuong${index + 1}`],
                    })
                  }
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
                  className={`border p-2 rounded ${selectedColor === color ? "border border-primary border-3" : ""}`}
                  style={{ width: "40px", height: "40px", backgroundColor: color, cursor: "pointer" }}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedImage(product[`HinhAnh${index + 1}`] || product.HinhAnh1);
                  }}
                ></div>
              ) : null
            )}
          </div>
        </div>

        <div className="mt-4">
          <h4>Thông tin sản phẩm</h4>
          <p><strong>Màn Hình:</strong> {product.ManHinh}</p>
          <p><strong>Camera:</strong> {product.CamSau} / {product.CamTruoc}</p>
          <p><strong>Pin:</strong> {product.LoaiPin}</p>
          <p><strong>CPU:</strong> {product.CPU}</p>
          <p><strong>Hệ điều hành:</strong> {product.HDH}</p>
          <p><strong>Mô tả:</strong> {product.MoTa}</p>
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;