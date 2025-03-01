import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import bcrypt from 'bcryptjs';
import { loginUsers } from '../../../service/api';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    Email: '', 
    MatKhau: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);
      const response = await loginUsers(formData);

      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        confirmAlert({
          title: 'Thành công',
          message: 'Đăng nhập thành công!',
          buttons: [
            {
              label: 'OK',
              onClick: () => {
                window.location.reload(); 
                navigate('/'); 
              },
            },
          ],
        });
      }
    } catch (e) {
      const errorMessage = e.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setError(errorMessage);
      
      confirmAlert({
        title: 'Lỗi',
        message: errorMessage,
        buttons: [{ label: 'OK', onClick: () => {} }]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const showPass = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex justify-end w-4/5 text-sm uppercase">
        <a href="/" className="text-orange-500">Trang Chủ</a>
        <span className="mx-2">/</span>
        <p>Đăng Nhập</p>
      </div>
      <div className="flex w-4/5 my-8">
        <div className="w-1/2 p-8 bg-white rounded-lg shadow-md">
          <h5 className="text-2xl font-bold mb-6 text-black">Đăng Nhập</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="relative">
                <i className="absolute left-3 top-1/2 transform -translate-y-1/2 fas fa-user text-gray-400"></i>
                <input
                  name="Email" 
                  type="email"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="Tài khoản Email"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="mb-6">
              <div className="relative">
                <i className="absolute left-3 top-1/2 transform -translate-y-1/2 fas fa-lock text-gray-400"></i>
                <input
                  name="MatKhau" 
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                  placeholder="Mật khẩu"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={showPass}
                >
                  {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
            </button>
            <div className="flex justify-evenly m-4 ">
              <Link to="/signup" className="text-blue-500 hover:underline ">Đăng ký</Link>
              <Link to="/forgot-password" className="text-blue-500 hover:underline">Quên mật khẩu</Link>
            </div>
          </form>
        </div>
        <div className="w-1/2 p-8">
          <div className="mb-8">
            <div className="flex items-center">
              <img src="/src/./img/feature_icon_1.png" className="w-12 mr-4" />
              <div>
                <h4 className="text-lg font-bold text-black">Mức độ uy tín!</h4>
                <p className="text-sm text-gray-600">Được đánh giá an toàn, tin cậy hàng đầu Việt Nam với nhiều chính sách hỗ trợ chăm sóc khách hàng.</p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex items-center">
              <img src="/src/./img/feature_icon_2.png" className="w-12 mr-4" />
              <div>
                <h4 className="text-lg font-bold text-black">Thanh toán tức thì!</h4>
                <p className="text-sm text-gray-600">Thanh toán mọi nơi mọi lúc, giao dịch nhanh gọn, bảo đảm, an toàn, với liên kết 90% ngân hàng, ví tiền, VISA trong toàn quốc!</p>
              </div>
            </div>
          </div>
          <div className="mb-8">
            <div className="flex items-center">
              <img src="/src/./img/feature_icon_3.png" className="w-12 mr-4" />
              <div>
                <h4 className="text-lg font-bold text-black">Ưu đãi hấp dẫn!</h4>
                <p className="text-sm text-gray-600">Với mong muốn làm hài lòng khách hàng, Mobistore luôn mang đến những ưu đãi cực kỳ tốt với chất lượng cao</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
