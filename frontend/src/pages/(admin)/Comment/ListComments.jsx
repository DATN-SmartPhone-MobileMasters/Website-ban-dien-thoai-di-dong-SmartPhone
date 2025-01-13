import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// interface IComment {
//   MaBL: number;
//   MaND: number;
//   MaSP: number;
//   NoiDung: string;
//   NgayBL: string;
// }

const AdminListComment = () => {
  const API_URL = "http://localhost:5000/cmt/comments/";

  const [comments, setComments] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(API_URL);
        setComments(data);
      } catch (error) {
        console.log(error);
        message.error("Lỗi khi lấy dữ liệu");
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa bình luận này không?")) {
      try {
        await axios.delete(`http://localhost:5000/cmt/comments/${id}`);
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
      <h1 className="h3 mb-2 text-gray-800">Tables</h1>
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
                  <th>Mã bình luận</th>
                  <th>Mã người dùng</th>
                  <th>Mã sản phẩm</th>
                  <th>Nội dung</th>
                  <th>Ngày bình luận</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment, i) => (
                  <tr key={i}>
                    <td>{comment._id}</td>
                    <td>{comment.MaND}</td>
                    <td>{comment.MaSP}</td>
                    <td className="text-truncate" style={{ maxWidth: "200px" }}>
                      {comment.NoiDung}
                    </td>
                    <td>{comment.NgayBL}</td>
                    <td>
                      <Link
                        to={`/comments/${comment._id}`}
                        className="btn btn-info"
                      >
                        Xem
                      </Link>

                      <button
                        className="btn btn-danger ml-2"
                        onClick={() => handleDelete(comment._id)}
                      >
                        Xóa
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

export default AdminListComment;
