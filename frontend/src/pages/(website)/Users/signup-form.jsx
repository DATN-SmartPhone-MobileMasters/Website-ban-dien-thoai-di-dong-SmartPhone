import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import bcrypt from 'bcryptjs';
import { signupUsers } from '../../../service/api';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    HoVaTen: '',
    SDT: '',
    Email: '',
    MatKhau: '', 
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.MatKhau !== formData.confirmPassword) {
      confirmAlert({
        title: 'Lỗi',
        message: 'Mật khẩu xác nhận không khớp',
        buttons: [{ label: 'OK', onClick: () => {} }]
      });
      return;
    }

    try {
      setIsLoading(true);
 
      const userData = {
        HoVaTen: formData.HoVaTen,
        SDT: formData.SDT,
        Email: formData.Email,
        MatKhau: formData.MatKhau,
        confirmPassword: formData.confirmPassword
      };
      const response = await signupUsers(userData);
      confirmAlert({
        title: 'Thành công',
        message: 'Đăng ký thành công!',
        buttons: [{ label: 'OK', onClick: () => navigate('/login') }]
      });
    } catch (e) {
      setError('Đăng ký thất bại. Vui lòng thử lại.');
      confirmAlert({
        title: 'Lỗi',
        message: error,
        buttons: [{ label: 'OK', onClick: () => {} }]
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
        <p>ĐĂNG KÝ</p>
      </div>
      <div className="flex w-4/5 my-8">
        <div className="w-1/2 p-8 bg-white rounded-lg shadow-md">
          <h5 className="text-2xl font-bold mb-6 text-black">Tạo tài khoản</h5>
          <p className="mb-6">Vui lòng điền đầy đủ các thông tin bên dưới</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <input
                name="HoVaTen"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Họ và tên"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <input
                name="SDT"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Số điện thoại"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <input
                name="Email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Email"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <input
                name="MatKhau" 
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Mật khẩu"
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-6">
              <input
                name="confirmPassword"
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Xác nhận mật khẩu"
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? 'Đang đăng ký...' : 'ĐĂNG KÝ'}
            </button>
            <div className="mt-4 text-center">
              <p>Bạn đã có tài khoản? <a href="/login" className="text-blue-500 hover:underline">Đăng Nhập</a></p>
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

export default SignupForm;
