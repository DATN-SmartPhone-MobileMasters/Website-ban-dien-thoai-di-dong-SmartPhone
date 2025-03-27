import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Spin, message } from "antd";
import { handleVNPayReturn } from "../../../service/api";

const OrderReturn = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processReturn = async () => {
      try {
        // Convert URLSearchParams to plain object
        const params = {};
        for (const [key, value] of searchParams.entries()) {
          params[key] = value;
        }

        // Send all VNPay params to backend for processing
        const response = await handleVNPayReturn(params);
        
        if (response.data.success) {
          if (response.data.paymentStatus === 'Chờ xử lý') {
            message.success('Thanh toán thành công!');
          } else {
            message.error('Thanh toán thất bại hoặc đã hủy');
          }
          navigate(`/profile-receipt/${response.data.orderId}`);
        } else {
          message.error(response.data.message || 'Có lỗi xảy ra');
          navigate('/');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        message.error('Lỗi hệ thống khi xử lý thanh toán');
        navigate('/');
      }
    };

    processReturn();
  }, [navigate, searchParams]);

  return (
    <div style={{ textAlign: "center", padding: "100px" }}>
      <Spin size="large" tip="Đang xử lý kết quả thanh toán..." />
    </div>
  );
};

export default OrderReturn;