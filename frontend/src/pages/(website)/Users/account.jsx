import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { updateUser } from '../../../service/api'; // Remove resetPassword import

const AccountPage = () => {
  const [userData, setUserData] = useState({
    HoVaTen: '',
    SDT: '',
    Email: '',
    DiaChi: '',
    NgaySinh: '',
    TaiKhoan:'',
    GioiTinh: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await updateUser(userData.id, userData);
      if (response.data.message) {
        confirmAlert({
          title: 'Thành công',
          message: 'Cập nhật thông tin thành công!',
          buttons: [{ label: 'OK', onClick: () => {} }],
        });
      }
    } catch (error) {
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      confirmAlert({
        title: 'Lỗi',
        message: error.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.',
        buttons: [{ label: 'OK', onClick: () => {} }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8">
        <div className="flex">
          {/* Left Container */}
          <div className="w-1/4 bg-white p-4 rounded-lg shadow-md mr-4">
            <div className="flex items-center mb-4">
              <span className="text-black font-semibold">{userData.Email}</span>
            </div>
            <ul className="space-y-2">
            <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/account-details/${userData.id}`} className="flex items-center gap-2">
                  <i className="fa fa-user mr-2"></i>
                  <span>Thông tin tài khoản</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/account/${userData.id}`} className="flex items-center gap-2">
                  <i className="fa fa-edit mr-2"></i>
                  <span>Cập nhập thông tin tài khoản</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/profile-receipt/${userData.id}`} className="flex items-center gap-2">
                  <i className="fas fa-money-check mr-2"></i>
                  <span>Quản lý đơn hàng</span>
                </Link>
              </li>
              <li className="flex items-center p-2 hover:bg-gray-200 rounded">
                <Link to={`/profile-reset-password/${userData.id}`} className="flex items-center gap-2">
                  <i className="fas fa-lock mr-2"></i>
                  <span>Đổi mật khẩu</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Container */}
          <div className="w-3/4 bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-light mb-6">Thông tin tài khoản</h3>
            <form onSubmit={handleUpdate}>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Tên Tài Khoản</label>
                <input
                  type="text"
                  name="TaiKhoan"
                  placeholder="Mời Nhập thông tin tên tài khoản"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={userData.TaiKhoan}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Họ & tên</label>
                <input
                  type="text"
                  name="HoVaTen"
                  placeholder="Mời Nhập thông tin họ tên"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={userData.HoVaTen}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Số điện thoại</label>
                <input
                  type="number"
                  name="SDT"
                  placeholder="Mời Nhập thông tin số điện thoại"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={userData.SDT}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Địa chỉ giao hàng</label>
                <input
                  type="text"
                  name="DiaChi"
                  placeholder="Mời Nhập thông tin địa chỉ"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={userData.DiaChi}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Giới tính</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="GioiTinh"
                      value="Nam"
                      checked={userData.GioiTinh === 'Nam'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Nam
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="GioiTinh"
                      value="Nữ"
                      checked={userData.GioiTinh === 'Nữ'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Nữ
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="GioiTinh"
                      value="Khác"
                      checked={userData.GioiTinh === 'Khác'}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    Khác
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;