import { message, Rate } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteComment, fetchComments, fetchUsers } from "../../../service/api";

const AdminListComment = () => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]); // State lưu danh sách người dùng
  const [products, setProducts] = useState([]); // State lưu danh sách sản phẩm

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resComments = await fetchComments();
        setComments(resComments.data);

        const resUsers = await fetchUsers();
        setUsers(resUsers.data);

        // const resProducts = await fetchProducts();
        // setProducts(resProducts.data);
      } catch (error) {
        console.error(error);
        // message.error("Lỗi khi lấy dữ liệu");
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này không?")) {
      try {
        await deleteComment(id);
        setComments(comments.filter((item) => item._id !== id));
        message.success("Đã xóa thành công");
      } catch (error) {
        console.error(error.message);
        message.error("Xóa thất bại");
      }
    }
  };

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Danh Sách Bình Luận</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Database bình luận
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Email</th>
                  <th>Nội dung</th>
                  <th>Đánh giá</th>
                  <th>Ngày bình luận</th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, i) => (
                  <tr key={i}>
                    {/* <td>{comment._id}</td>
                    <td>{comment.MaND}</td>
                    <td>{comment.MaSP}</td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {comment.NoiDung}
                    </td>
                    <td>
                      <Rate disabled defaultValue={parseInt(comment.DanhGia)} />
                    </td>
                    <td>{new Date(comment.NgayBL).toLocaleDateString()}</td> */}
                    <td>{comment.SoThuTu}</td>
                    <td>{comment.Email}</td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {comment.NoiDung}
                    </td>
                    <td>
                      <Rate disabled defaultValue={parseInt(comment.DanhGia)} />
                    </td>
                    <td>{new Date(comment.NgayBL).toLocaleDateString()}</td>
                    <td>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Link
                          to={`/admin/comments/${comment._id}`}
                          className="btn btn-info"
                          style={{ flex: "1", marginRight: "5px" }}
                        >
                          Xem
                        </Link>
                        <button
                          className="btn btn-danger"
                          style={{ flex: "1" }}
                          onClick={() => handleDelete(comment._id)}
                        >
                          Xóa
                        </button>
                      </div>
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

export default AdminListComment;
