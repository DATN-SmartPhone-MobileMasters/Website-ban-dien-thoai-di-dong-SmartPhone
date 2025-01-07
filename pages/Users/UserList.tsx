import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: { $oid: string };
  MaND: number;
  HoVaTen: string;
  GioiTinh: string;
  SDT: string;
  Email: string;
  DiaChi: string;
  TaiKhoan: string;
  MatKhau: string;
  MaQuyen: number;
  TrangThai: number;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<User[]>('http://localhost:3000/users'); 
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      setUsers(users.filter(user => user._id.$oid !== id));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">User List</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">
            Users Table
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SĐT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa Chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai Trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id.$oid}>
                  <td className="px-6 py-4 whitespace-nowrap">{user.MaND}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.HoVaTen}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.GioiTinh}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.SDT}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.Email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.DiaChi}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.TaiKhoan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.MaQuyen}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.TrangThai === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.TrangThai === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleDelete(user._id.$oid)}
                      variant="destructive"
                      size="sm"
                    >
                      Xoá Tài Khoản
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;

