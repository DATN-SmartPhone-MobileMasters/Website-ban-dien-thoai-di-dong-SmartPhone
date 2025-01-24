import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const AdminDetailComment = () => {
  const { id } = useParams();
  const API_URL = `http://localhost:5000/api/comments/${id}`;

  const [comment, setComment] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(API_URL);
        setComment(response.data.data);
      } catch (error) {
        console.log(error);
        message.error("Lỗi khi lấy dữ liệu");
      }
    })();
  }, [id]);

  if (!comment) return <p>Đang tải dữ liệu...</p>; // Hiển thị khi dữ liệu chưa sẵn sàng

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Chi tiết bình luận</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Thông tin chi tiết bình luận
          </h6>
        </div>
        <div className="card-body">
          <p>
            <strong>Mã bình luận:</strong> {comment._id}
          </p>
          <p>
            <strong>Mã người dùng:</strong> {comment.MaND}
          </p>
          <p>
            <strong>Mã sản phẩm:</strong> {comment.MaSP}
          </p>
          <p>
            <strong>Nội dung:</strong> {comment.NoiDung}
          </p>
          <p>
            <strong>Ngày bình luận:</strong> {comment.NgayBL}
          </p>
          <p>
            <strong>Hình ảnh sản phẩm:</strong>
            <br />
            <img
              src={comment.HinhAnhSP}
              alt="Hình ảnh sản phẩm"
              style={{ width: "200px", marginTop: "5px" }}
            />
          </p>
          <Link to="/comments" className="btn btn-primary mt-3">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailComment;
