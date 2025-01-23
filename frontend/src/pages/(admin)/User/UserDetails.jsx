import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserDetails = () => {
  const [user, setUser] = useState(null); 
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User Details</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden rounded mb-3 ">
        <div className="px-6 py-4 border-b border-gray-200 ml-2">
          <h2 className="text-xl font-semibold text-gray-700">
            {user.HoVaTen}
          </h2>
        </div>
        <div className="p-6 ml-2">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">ID</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.MaND}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Tên Tài Khoản</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.TaiKhoan}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Họ Và Tên</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.HoVaTen}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Giới Tính</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.GioiTinh}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">SĐT</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.SDT}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.Email}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Địa Chỉ</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.DiaChi}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Vai Trò</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.MaQuyen === 1 ? 'Admin' : 'User'}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Trạng Thái</dt>
              <dd className="mt-1 text-sm text-gray-900">{user.TrangThai === 1 ? 'Active' : 'Inactive'}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-6 ">
        <button 
          onClick={() => navigate('/accounts')}
          className="btn btn-primary"
        >
          Quay Về
        </button>
      </div>
    </div>
  );
};

export default UserDetails;

