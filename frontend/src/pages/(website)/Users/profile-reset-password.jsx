import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { updatePassword } from '../../../service/api';

const ProfileResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const storedUserData = localStorage.getItem('userData');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
     confirmAlert({
        title: 'Lỗi',
        message: 'Mật khẩu xác nhận không khớp',
        buttons: [{ label: 'OK', onClick: () => {} }]
      });
      return;
    }
  
    try {
      setIsLoading(true);
      if (!userData) {
        setError('Không tìm thấy thông tin người dùng.');
        return;
      }

      console.log("User ID:", userData.id);
  
      const response = await updatePassword(userData.id, { MatKhau: newPassword });
      if (response.data.message) {
        confirmAlert({
          title: 'Thành công',
          message: 'Mật khẩu đã được đặt lại thành công!',
          buttons: [{ label: 'OK', onClick: () => {
            window.location.reload(); 
          },  }],
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
            <h3 className="text-2xl font-light mb-6">Đổi mật khẩu</h3>
            <form onSubmit={handleResetPassword}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
                <input
                  type="password"
                  placeholder="Mật khẩu mới"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  placeholder="Xác nhận mật khẩu"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileResetPasswordPage;
