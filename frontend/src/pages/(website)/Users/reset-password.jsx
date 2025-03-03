import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { resetPassword } from '../../../service/api';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token'); // Extract token from URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPassword({ token, MatKhau: newPassword });

      if (response.data.message) {
        confirmAlert({
          title: 'Thành công',
          message: response.data.message,
          buttons: [
            {
              label: 'OK',
              onClick: () => navigate('/login'),
            },
          ],
        });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.';
      setError(errorMessage);
      
      confirmAlert({
        title: 'Lỗi',
        message: errorMessage,
        buttons: [{ label: 'OK', onClick: () => {} }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex justify-end w-4/5 text-sm uppercase">
        <a href="/" className="text-orange-500">Trang Chủ</a>
        <span className="mx-2">/</span>
        <p>Đặt Lại Mật Khẩu</p>
      </div>
      <div className="w-4/5 p-8 bg-white rounded-lg shadow-md">
        <h5 className="text-2xl font-bold mb-6 text-black">Đặt Lại Mật Khẩu</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <div className="relative">
              <i className="absolute left-3 top-1/2 transform -translate-y-1/2 fas fa-lock text-gray-400"></i>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <div className="relative">
              <i className="absolute left-3 top-1/2 transform -translate-y-1/2 fas fa-lock text-gray-400"></i>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300"
            disabled={isLoading}
          >
            {isLoading ? 'Đang xử lý...' : 'Đặt Lại Mật Khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;