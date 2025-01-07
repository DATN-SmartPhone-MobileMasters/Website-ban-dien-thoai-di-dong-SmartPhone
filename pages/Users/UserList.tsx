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
    const fetchUsers = async () => {
      try {
        const res = await axios.get<User[]>('http://localhost:3000/users'); 
        setUsers(res.data);
      } catch (e) {
        console.error( e);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <div>
        <h1 className="h3 mb-2 text-gray-800">User List</h1>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              Users Table
            </h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table
                className="table table-bordered"
                id="dataTable"
                width="100vw"
                cellSpacing={0}
              >
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Giới tính</th>
                    <th>SĐT</th>
                    <th>Email</th>
                    <th>Địa Chỉ</th>
                    <th>Username</th>
                    <th>Vai Trò</th>
                    <th>Trạng Thái</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id.$oid}>
                      <td>{user.MaND}</td>
                      <td>{user.HoVaTen}</td>
                      <td>{user.GioiTinh}</td>
                      <td>{user.SDT}</td>
                      <td>{user.Email}</td>
                      <td>{user.DiaChi}</td>
                      <td>{user.TaiKhoan}</td>
                      <td>{user.MaQuyen}</td>
                      <td>{user.TrangThai === 1 ? 'Active' : 'Inactive'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserList;

