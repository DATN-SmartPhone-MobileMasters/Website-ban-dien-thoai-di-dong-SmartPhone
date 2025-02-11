import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fetchUsers, deleteUser } from '../../../service/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetchUsers(); 
      setUsers(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Xác nhận xóa',
      message: 'Bạn có chắc muốn xoá tài khoản này?',
      buttons: [
        {
          label: 'Có',
          onClick: async () => {
            try {
              await deleteUser(id); 
              setUsers(users.filter((user) => user._id !== id));
            } catch (e) {
              console.error(e);
            }
          },
        },
        {
          label: 'Không',
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

  if (users.length === 0) {
    return <div className="text-center mt-5">Loading...</div>;
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
                        onClick={() => handleViewDetails(user._id)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-xs transition duration-200 ease-in-out shadow-md hover:shadow-lg mr-2"
                      >
                        Chi Tiết
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-xs transition duration-200 ease-in-out shadow-md hover:shadow-lg"
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
