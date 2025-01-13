import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminDetailComment = () => {
  const { id } = useParams();
  const API_URL = `http://localhost:5000/cmt/comments/${id}`;

  const [comment, setComment] = useState(null);

  useEffect(() => {
    console.log(API_URL);

    (async () => {
      try {
        const response = await axios.get(API_URL);
        // console.log(response.data);
        setComment(response.data.data); //lấy dl  từ object
      } catch (error) {
        console.log(error);
        message.error("Lỗi khi lấy dữ liệu");
      }
    })();
  }, [id]);

  //   console.log(comment);

  if (!comment) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="h3 mb-2 text-gray-800">Chi tiết bình luận</h1>
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary">
            Thông tin chi tiết
          </h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table hover table-bordered dataTable no-footer">
              <thead>
                <tr>
                  <th>Mã bình luận</th>
                  <th>Mã người dùng</th>
                  <th>Mã sản phẩm</th>
                  <th>Nội dung</th>
                  <th>Ngày bình luận</th>
                  <th style={{ width: "300px" }}>Hình ảnh sản phẩm</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{comment.MaBL}</td>
                  <td>{comment.MaND}</td>
                  <td>{comment.MaSP}</td>
                  <td>{comment.NoiDung}</td>
                  <td>{comment.NgayBL}</td>
                  <td>
                    <img
                      src={comment.HinhAnhSP}
                      alt="Hình ảnh sản phẩm"
                      style={{ width: "100px", height: "100px" }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailComment;
