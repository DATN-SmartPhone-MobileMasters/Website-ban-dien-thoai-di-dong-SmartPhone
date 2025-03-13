import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import bcrypt from 'bcryptjs';
import { loginUsers,updateUser } from './../../service/api';

const AdminLogin = () => {
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
          const user = response.data.user;
          
          if (user.MaQuyen !== 1) {
            confirmAlert({
              title: 'Lỗi',
              message: 'Chỉ có admin mới có thể đăng nhập',
              buttons: [{ label: 'OK', onClick: () => {} }]
            });
            setIsLoading(false);
            return; 
          }
         
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userData', JSON.stringify(user));
  
          await updateUser(user.id, { TrangThai: 1 });
    
          confirmAlert({
            title: 'Thành công',
            message: 'Đăng nhập thành công!',
            buttons: [
              {
                label: 'OK',
                onClick: () => {
                  navigate('/admin/dashboard'); 
                  window.location.reload(); 
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
        <p>Đăng Nhập Admin</p>
      </div>
      <div className="flex justify-center w-full">
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
          </form>
        </div>
      </div>
    </div>
  );  
};

export default AdminLogin;