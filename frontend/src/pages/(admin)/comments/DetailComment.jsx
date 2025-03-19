import { message, Rate } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchCommentById } from "../../../service/api";

const AdminDetailComment = () => {
  const { id } = useParams();
  const [comment, setComment] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetchCommentById(id);
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
          <div className="mb-4">
            <strong>Mã bình luận:</strong> {comment._id}
          </div>
          {/* <div className="mb-4">
            <strong>Tên Sản Phẩm:</strong> {comment.TenSP}
          </div> */}
          <div className="mb-4">
            <strong>Email:</strong> {comment.Email}
          </div>
          <div className="mb-4">
            <strong>Mã sản phẩm:</strong> {comment.MaSP}
          </div>
          <div className="mb-4">
            <strong>Nội dung:</strong> {comment.NoiDung}
          </div>
          <div className="mb-4">
            <strong>Đánh giá:</strong>{" "}
            <Rate disabled defaultValue={parseInt(comment.DanhGia)} />
          </div>
          <div className="mb-4">
            <strong>Ngày bình luận:</strong>{" "}
            {new Date(comment.NgayBL).toLocaleDateString()}
          </div>
          {/* <div className="mb-4">
            <strong>Hình ảnh sản phẩm:</strong>
            <br />
            <img
              src={comment.HinhAnhSP}
              alt="Hình ảnh sản phẩm"
              style={{ width: "200px", marginTop: "5px" }}
            />
          </div> */}
          <Link to="/admin/comments" className="btn btn-primary mt-3">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailComment;
