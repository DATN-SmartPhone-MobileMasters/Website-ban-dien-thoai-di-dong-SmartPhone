import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducts, fetchBrands } from "../../../service/api";

const ProductsAdd = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    MaSP: '',
    TenSP: '',
    TenTH: '',
    MoTa: '',
    CapSac: '',
    BoNhoTrong1: '',
    BoNhoTrong2: '',
    BoNhoTrong3: '',
    Mau1: '',
    Mau2: '',
    Mau3: '',
    ManHinh: '',
    HDH: '',
    CamSau: '',
    CamTruoc: '',
    CPU: '',
    LoaiPin: '',
    TrangThai: '',
    SoLuong1: '',
    SoLuong2: '',
    SoLuong3: '',
    GiaSP1: '',
    GiaSP2: '',
    GiaSP3: '',
    HinhAnh1: '',
    HinhAnh2: '',
    HinhAnh3: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBrands()
      .then((res) => setBrands(res.data.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProducts(product);
      navigate('/admin/products');
    } catch (error) {
      setError('Không thể thêm sản phẩm.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="mb-4">Thêm Sản Phẩm</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="card shadow mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="MaSP">Mã Sản Phẩm</label>
                  <input
                    type="text"
                    id="MaSP"
                    name="MaSP"
                    className="form-control"
                    value={product.MaSP}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="TenSP">Tên Sản Phẩm</label>
                  <input
                    type="text"
                    id="TenSP"
                    name="TenSP"
                    className="form-control"
                    value={product.TenSP}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="TenTH">Thương Hiệu</label>
                  <select
                    id="TenTH"
                    name="TenTH"
                    className="form-control"
                    value={product.TenTH}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.map((brand) => (
                      <option key={brand._id} value={brand.TenTH}>
                        {brand.TenTH}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="BoNhoTrong1">Bộ Nhớ Trong 1</label>
                  <select
                    id="BoNhoTrong1"
                    name="BoNhoTrong1"
                    className="form-control"
                    value={product.BoNhoTrong1}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn bộ nhớ</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>


                <div className="form-group">
                  <label htmlFor="BoNhoTrong2">Bộ Nhớ Trong 2</label>
                  <select
                    id="BoNhoTrong2"
                    name="BoNhoTrong2"
                    className="form-control"
                    value={product.BoNhoTrong2}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn bộ nhớ</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>


                <div className="form-group">
                  <label htmlFor="BoNhoTrong3">Bộ Nhớ Trong 3</label>
                  <select
                    id="BoNhoTrong3"
                    name="BoNhoTrong3"
                    className="form-control"
                    value={product.BoNhoTrong3}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn bộ nhớ</option>
                    <option value="64GB">64GB</option>
                    <option value="128GB">128GB</option>
                    <option value="256GB">256GB</option>
                    <option value="512GB">512GB</option>
                    <option value="1TB">1TB</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="Mau1">Màu 1</label>
                  <input
                    type="text"
                    id="Mau1"
                    name="Mau1"
                    className="form-control"
                    value={product.Mau1}
                    onChange={handleChange}
                  />
                  {product.Mau1 && (
                    <div style={{ marginTop: '10px', height: '30px', width: '30px', backgroundColor: product.Mau1 }}></div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="Mau2">Màu 2</label>
                  <input
                    type="text"
                    id="Mau2"
                    name="Mau2"
                    className="form-control"
                    value={product.Mau2 || ""}
                    onChange={handleChange}
                    placeholder="Nhập mã màu hoặc để trống"
                  />
                  {product.Mau2 && product.Mau2.trim() && (
                    <div
                      style={{
                        marginTop: "10px",
                        height: "30px",
                        width: "30px",
                        backgroundColor: product.Mau2,
                        border: "1px solid #ccc",
                      }}
                    ></div>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="Mau3">Màu 3</label>
                  <input
                    type="text"
                    id="Mau3"
                    name="Mau3"
                    className="form-control"
                    value={product.Mau3 || ""}
                    onChange={handleChange}
                    placeholder="Nhập mã màu hoặc để trống"
                  />
                  {product.Mau3 && product.Mau3.trim() && (
                    <div
                      style={{
                        marginTop: "10px",
                        height: "30px",
                        width: "30px",
                        backgroundColor: product.Mau3,
                        border: "1px solid #ccc",
                      }}
                    ></div>
                  )}
                </div>



              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="ManHinh">Màn Hình</label>
                  <input
                    type="text"
                    id="ManHinh"
                    name="ManHinh"
                    className="form-control"
                    value={product.ManHinh}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="HDH">Hệ Điều Hành</label>
                  <input
                    type="text"
                    id="HDH"
                    name="HDH"
                    className="form-control"
                    value={product.HDH}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="CamSau">Camera Sau</label>
                  <input
                    type="text"
                    id="CamSau"
                    name="CamSau"
                    className="form-control"
                    value={product.CamSau}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="CamTruoc">Camera Trước</label>
                  <input
                    type="text"
                    id="CamTruoc"
                    name="CamTruoc"
                    className="form-control"
                    value={product.CamTruoc}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="CPU">CPU</label>
                  <input
                    type="text"
                    id="CPU"
                    name="CPU"
                    className="form-control"
                    value={product.CPU}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="CapSac">Cáp sạc</label>
                  <select
                    id="CapSac"
                    name="CapSac"
                    className="form-control"
                    value={product.CapSac}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn loại cáp</option>
                    <option value="Type-C">Type-C</option>
                    <option value="Lightning">Lightning</option>
                    <option value="USB">USB</option>
                  </select>
                </div>


                <div className="form-group">
                  <label htmlFor="MoTa">Mô tả</label>
                  <input
                    type="text"
                    id="MoTa"
                    name="MoTa"
                    className="form-control"
                    value={product.MoTa}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="LoaiPin">Pin</label>
                  <input
                    type="text"
                    id="LoaiPin"
                    name="LoaiPin"
                    className="form-control"
                    value={product.LoaiPin}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="TrangThai">Trạng Thái</label>
                  <select
                    id="TrangThai"
                    name="TrangThai"
                    className="form-control"
                    value={product.TrangThai}
                    onChange={handleChange}
                  >
                    <option value="">Vui lòng chọn</option>
                    <option value="Còn hàng">Còn hàng</option>
                    <option value="Hết hàng">Hết hàng</option>
                  </select>
                </div>

              </div>


            </div>

            <div className="form-group">
              <label htmlFor="SoLuong1">Số Lượng 1</label>
              <input
                type="number"
                id="SoLuong1"
                name="SoLuong1"
                className="form-control"
                value={product.SoLuong1}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="SoLuong2">Số Lượng 2</label>
              <input
                type="number"
                id="SoLuong2"
                name="SoLuong2"
                className="form-control"
                value={product.SoLuong2}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="SoLuong3">Số Lượng 3</label>
              <input
                type="number"
                id="SoLuong3"
                name="SoLuong3"
                className="form-control"
                value={product.SoLuong3}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="GiaSP1">Giá 1</label>
              <input
                type="number"
                id="GiaSP1"
                name="GiaSP1"
                className="form-control"
                value={product.GiaSP1}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="GiaSP2">Giá 2</label>
              <input
                type="number"
                id="GiaSP2"
                name="GiaSP2"
                className="form-control"
                value={product.GiaSP2}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="GiaSP3">Giá 3</label>
              <input
                type="number"
                id="GiaSP3"
                name="GiaSP3"
                className="form-control"
                value={product.GiaSP3}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="HinhAnh1">Hình Ảnh 1</label>
              <input
                type="text"
                id="HinhAnh1"
                name="HinhAnh1"
                className="form-control"
                value={product.HinhAnh1}
                onChange={handleChange}
              />
              {product.HinhAnh1 && <img src={product.HinhAnh1} alt="Hình Ảnh 1" style={{ marginTop: '10px', maxWidth: '100px', maxHeight: '100px' }} />}
            </div>
            <div className="form-group">
              <label htmlFor="HinhAnh2">Hình Ảnh 2</label>
              <input
                type="text"
                id="HinhAnh2"
                name="HinhAnh2"
                className="form-control"
                value={product.HinhAnh2}
                onChange={handleChange}
              />
              {product.HinhAnh2 && <img src={product.HinhAnh2} alt="Hình Ảnh 2" style={{ marginTop: '10px', maxWidth: '100px', maxHeight: '100px' }} />}
            </div>
            <div className="form-group">
              <label htmlFor="HinhAnh3">Hình Ảnh 3</label>
              <input
                type="text"
                id="HinhAnh3"
                name="HinhAnh3"
                className="form-control"
                value={product.HinhAnh3}
                onChange={handleChange}
              />
              {product.HinhAnh3 && <img src={product.HinhAnh3} alt="Hình Ảnh 3" style={{ marginTop: '10px', maxWidth: '100px', maxHeight: '100px' }} />}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Đang thêm sản phẩm...' : 'Thêm Sản Phẩm'}
        </button>
      </form>
    </div>
  );
};

export default ProductsAdd;
