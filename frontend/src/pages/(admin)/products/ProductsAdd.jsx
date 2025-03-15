import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProducts, fetchBrands, uploadImage } from "../../../service/api";

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

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await uploadImage(formData);
      console.log('Image upload response:', response.data);
      setProduct(prev => ({
        ...prev,
        [fieldName]: response.data.imageUrl
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      setError(`Tải ảnh ${fieldName} lên thất bại`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createProducts(product);
      navigate('/admin/products');
    } catch (error) {
      console.error('Create product error:', error.response?.data);
      setError(error.response?.data?.message || 'Không thể thêm sản phẩm.');
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
                  <label htmlFor="SoLuong1" style={{ color: 'red' }}>Số Lượng Bộ Nhớ 1</label>
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
                  <label htmlFor="SoLuong2" style={{ color: 'aqua' }}>Số Lượng Bộ Nhớ 2</label>
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
                  <label htmlFor="SoLuong3" style={{ color: 'lime' }}>Số Lượng Bộ Nhớ 3</label>
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
                  <label htmlFor="ManHinh">Màn Hình</label>
                  <select
                    id="ManHinh"
                    name="ManHinh"
                    className="form-control"
                    value={product.ManHinh}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn kích thước màn hình</option>
                    <option value="5inch">5 inch</option>
                    <option value="5.1inch">5.1 inch</option>
                    <option value="6inch">6 inch</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="HDH">Hệ Điều Hành</label>
                  <select
                    id="HDH"
                    name="HDH"
                    className="form-control"
                    value={product.HDH}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn hệ điều hành</option>
                    <option value="IOS">IOS</option>
                    <option value="ANDROID">ANDROID</option>
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
                  <select
                    id="LoaiPin"
                    name="LoaiPin"
                    className="form-control"
                    value={product.LoaiPin}
                    onChange={handleChange}
                  >
                    <option value="">Chọn loại pin</option>
                    <option value="PISEN">PISEN</option>
                    <option value="Energizer">Energizer</option>
                    <option value="Duracell">Duracell</option>
                  </select>
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
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="Mau1">Màu 1</label>
                  <select
                    id="Mau1"
                    name="Mau1"
                    className="form-control"
                    value={product.Mau1}
                    onChange={handleChange}
                  >
                    <option value="">Chọn màu</option>
                    <option value="black">Black</option>
                    <option value="silver">Silver</option>
                    <option value="white">White</option>
                    <option value="grey">Grey</option>
                    <option value="purple">Purple</option>
                  </select>
                  {product.Mau1 && (
                    <div style={{ marginTop: '10px', height: '30px', width: '30px', backgroundColor: product.Mau1 }}></div>
                  )}
                </div>
                <div className="form-group">
                <label htmlFor="SoLuongMau1_1" style={{ color: 'red' }}>Số Lượng Màu 1.1</label>
                  <input
                    type="number"
                    id="SoLuongMau1_1"
                    name="SoLuongMau1_1"
                    className="form-control"
                    value={product.SoLuongMau1_1}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="SoLuongMau2_1" style={{ color: 'aqua' }}>Số Lượng Màu 2.1</label>
                  <input
                    type="number"
                    id="SoLuongMau2_1"
                    name="SoLuongMau2_1"
                    className="form-control"
                    value={product.SoLuongMau2_1}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="SoLuongMau3_1" style={{ color: 'lime' }}>Số Lượng Màu 3.1</label>
                  <input
                    type="number"
                    id="SoLuongMau3_1"
                    name="SoLuongMau3_1"
                    className="form-control"
                    value={product.SoLuongMau3_1}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Mau2">Màu 2</label>
                  <select
                    id="Mau2"
                    name="Mau2"
                    className="form-control"
                    value={product.Mau2}
                    onChange={handleChange}
                  >
                    <option value="">Chọn màu</option>
                    <option value="black">Black</option>
                    <option value="silver">Silver</option>
                    <option value="white">White</option>
                    <option value="grey">Grey</option>
                    <option value="purple">Purple</option>
                  </select>
                  {product.Mau2 && (
                    <div style={{ marginTop: '10px', height: '30px', width: '30px', backgroundColor: product.Mau2 }}></div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="SoLuongMau1_2" style={{ color: 'red' }}>Số Lượng Màu 1.2</label>
                  <input
                    type="number"
                    id="SoLuongMau1_2"
                    name="SoLuongMau1_2"
                    className="form-control"
                    value={product.SoLuongMau1_2}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="SoLuongMau2_2" style={{ color: 'aqua' }}>Số Lượng Màu 2.2</label>
                  <input
                    type="number"
                    id="SoLuongMau2_2"
                    name="SoLuongMau2_2"
                    className="form-control"
                    value={product.SoLuongMau2_2}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="SoLuongMau3_2" style={{ color: 'lime' }}>Số Lượng Màu 3.2</label>
                  <input
                    type="number"
                    id="SoLuongMau3_2"
                    name="SoLuongMau3_2"
                    className="form-control"
                    value={product.SoLuongMau3_2}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Mau3">Màu 3</label>
                  <select
                    id="Mau3"
                    name="Mau3"
                    className="form-control"
                    value={product.Mau3}
                    onChange={handleChange}
                  >
                    <option value="">Chọn màu</option>
                    <option value="black">Black</option>
                    <option value="silver">Silver</option>
                    <option value="white">White</option>
                    <option value="grey">Grey</option>
                    <option value="purple">Purple</option>
                  </select>
                  {product.Mau3 && (
                    <div style={{ marginTop: '10px', height: '30px', width: '30px', backgroundColor: product.Mau3 }}></div>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="SoLuongMau1_3" style={{ color: 'red' }}>Số Lượng Màu 1.3</label>
                  <input
                    type="number"
                    id="SoLuongMau1_3"
                    name="SoLuongMau1_3"
                    className="form-control"
                    value={product.SoLuongMau1_3}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="SoLuongMau2_3" style={{ color: 'aqua' }}>Số Lượng Màu 2.3</label>
                  <input
                    type="number"
                    id="SoLuongMau2_3"
                    name="SoLuongMau2_3"
                    className="form-control"
                    value={product.SoLuongMau2_3}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="SoLuongMau3_3" style={{ color: 'lime' }}>Số Lượng Màu 3.3</label>
                  <input
                    type="number"
                    id="SoLuongMau3_3"
                    name="SoLuongMau3_3"
                    className="form-control"
                    value={product.SoLuongMau3_3}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="CamSau">Camera Sau</label>
                  <select
                    id="CamSau"
                    name="CamSau"
                    className="form-control"
                    value={product.CamSau}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn độ phân giải</option>
                    <option value="16px">16 PX</option>
                    <option value="20px">20 PX</option>
                    <option value="25px">25 PX</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="CamTruoc">Camera Trước</label>
                  <select
                    id="CamTruoc"
                    name="CamTruoc"
                    className="form-control"
                    value={product.CamTruoc}
                    onChange={handleChange}
                  >
                    <option value="">Chọn độ phân giải</option>
                    <option value="30px">30 PX</option>
                    <option value="35px">35 PX</option>
                    <option value="40px">40 PX</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="CPU">CPU</label>
                  <select
                    id="CPU"
                    name="CPU"
                    className="form-control"
                    value={product.CPU}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Chọn loại CPU</option>
                    <option value="APPLE CHIPSET">APPLE CHIPSET</option>
                    <option value="ANDROID CHIPSET">ANDROID CHIPSET</option>
                  </select>
                </div>
              </div>
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
                type="file"
                id="HinhAnh1"
                className="form-control"
                onChange={(e) => handleImageUpload(e, 'HinhAnh1')}
                accept="image/*"
                required
              />
              {product.HinhAnh1 && (
                <img
                  src={product.HinhAnh1}
                  alt="Preview 1"
                  style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="HinhAnh2">Hình Ảnh 2</label>
              <input
                type="file"
                id="HinhAnh2"
                className="form-control"
                onChange={(e) => handleImageUpload(e, 'HinhAnh2')}
                accept="image/*"
              />
              {product.HinhAnh2 && (
                <img
                  src={product.HinhAnh2}
                  alt="Preview 2"
                  style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                />
              )}
            </div>
            <div className="form-group">
              <label htmlFor="HinhAnh3">Hình Ảnh 3</label>
              <input
                type="file"
                id="HinhAnh3"
                className="form-control"
                onChange={(e) => handleImageUpload(e, 'HinhAnh3')}
                accept="image/*"
              />
              {product.HinhAnh3 && (
                <img
                  src={product.HinhAnh3}
                  alt="Preview 3"
                  style={{ marginTop: '10px', maxWidth: '150px', maxHeight: '150px' }}
                />
              )}
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