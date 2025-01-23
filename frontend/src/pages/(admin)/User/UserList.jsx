import React, { useState, useEffect } from 'react';
import axios from 'axios'; // npm i axios
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert'; // npm i react-confirm-alert
import 'react-confirm-alert/src/react-confirm-alert.css';
import '../../../App.css'; // Import App.css
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/api/users');
      setUsers(res.data);
    } catch (e) {
      console.error(e);
      setError('Không tìm thấy dữ liệu, mời thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: "Xác nhận xóa",
      message: "Bạn có chắc muốn xoá tài khoản này ?",
      buttons: [
        {
          label: "Có",
          onClick: async () => {
            try {
              await axios.delete(`http://localhost:5000/api/users/${id}`);
              setUsers(users.filter(user => user._id !== id));
            } catch (e) {
              console.error(e);
              setError('Lỗi, mời thử lại.');
            }
          },
        },
        {
          label: "Không",
          onClick: () => {},
        },
      ],
      closeOnEscape: true,
      closeOnClickOutside: true,
    });
  };

  const handleViewDetails = (id) => {
    navigate(`/accounts/${id}`);
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 min-w-[100vw]">
      <h1 className="h3 mb-2 text-gray-800">User Management</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Users List</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered" width="100%" cellSpacing={0}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ Và Tên</th>
                  <th>Tên Tài Khoản</th>
                  <th>Email</th>
                  <th>Giới Tính</th>
                  <th>Vai Trò</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.MaND}</td>
                    <td>{user.HoVaTen}</td>
                    <td>{user.TaiKhoan}</td>
                    <td>{user.Email}</td>
                    <td>{user.GioiTinh}</td>
                    <td>{user.MaQuyen === 1 ? 'Admin' : 'User'}</td>
                    <td className="space-x-2">
                      <button 
                      id="viewDetailsButton"
                      onClick={() => handleViewDetails(user._id)}
                    >
                      Chi Tiết 
                    </button>
                    <button 
                      id="deleteButton"
                      onClick={() => handleDelete(user._id)}
                    >
                      Xoá
                    </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
