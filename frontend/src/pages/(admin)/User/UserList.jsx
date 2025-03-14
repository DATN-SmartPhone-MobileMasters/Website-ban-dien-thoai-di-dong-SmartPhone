import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { fetchUsers,fetchOrdersByUserId, deleteUser } from '../../../service/api';

const UserList = () => {
  const [users, setUsers] = useState([]);

 useEffect(() => {
    fetchUsers()
      .then((res) => setUsers(res.data || []))
      .catch(console.error);
  }, []);


  const handleDelete = async (id) => {
    try {
      const ordersResponse = await fetchOrdersByUserId(id);
      const hasOrders = ordersResponse.data.data?.length > 0;
  
      confirmAlert({
        title: 'Xác nhận xóa',
        message: hasOrders 
          ? 'Tài khoản này có đơn hàng. Bạn có chắc muốn xoá tài khoản và tất cả đơn hàng liên quan?' 
          : 'Bạn có chắc muốn xoá tài khoản này?',
        buttons: [
          {
            label: 'Có',
            onClick: async () => {
              try {
                await deleteUser(id); // This now deletes user + orders (backend)
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
    } catch (error) {
      console.error("Lỗi khi kiểm tra đơn hàng:", error);
    }
  };


   if (!users || users.length === 0) { 
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="h3 mb-2 text-gray-800">User Management</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">Users List</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table
              className="table table-bordered"
              width="100%"
              cellSpacing={0}
            >
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
                    <td>{user.MaQuyen === 1 ? "Admin" : "User"}</td>
                    <td className="space-x-2">
                      <Link to={`/admin/accounts-details/${user._id}`} className="text-blue-500 hover:underline">
                        <button className="btn btn-info ml-2">Chi tiết</button>
                      </Link>
                      {user.MaQuyen === 0 && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="btn btn-danger ml-2"
                        >
                          Xoá
                        </button>
                      )}
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
