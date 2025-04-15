import React from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  Button,
  message,
} from "antd";
import { useNavigate } from "react-router-dom";
import { createPromotion } from "../../../service/api";
import dayjs from "dayjs";

const { Option } = Select;

const AddPromotion = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const formattedData = {
        ...values,
        NgayBD: values.NgayBD.format("YYYY-MM-DD"),
        NgayKT: values.NgayKT.format("YYYY-MM-DD"),
      };

      await createPromotion(formattedData);
      message.success("Thêm khuyến mãi thành công!");
      navigate("/admin/vouchers");
    } catch (error) {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi thêm khuyến mãi."
      );
    }
  };

  return (
    <div className="container">
      <h1 className="h3 text-gray-800 mb-4">Thêm Khuyến Mãi</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          TrangThai: undefined,
          LoaiKM: undefined,
        }}
      >
        <Form.Item
          label="Mã Khuyến Mãi"
          name="MaKM"
          rules={[
            { required: true, message: "Mã khuyến mãi là trường bắt buộc" },
            { min: 3, message: "Mã khuyến mãi phải có ít nhất 3 ký tự" },
            { max: 20, message: "Mã khuyến mãi không được dài quá 20 ký tự" },
          ]}
        >
          <Input placeholder="Nhập mã khuyến mãi" />
        </Form.Item>

        <Form.Item
          label="Tên Khuyến Mãi"
          name="TenKM"
          rules={[
            { required: true, message: "Tên khuyến mãi là trường bắt buộc" },
          ]}
        >
          <Input placeholder="Nhập tên khuyến mãi" />
        </Form.Item>

        <Form.Item
          label="Loại Khuyến Mãi"
          name="LoaiKM"
          rules={[
            { required: true, message: "Loại khuyến mãi là trường bắt buộc" },
          ]}
        >
          <Select placeholder="Chọn loại khuyến mãi">
            <Option value="fixed">Giảm số tiền cố định</Option>
            <Option value="percentage">Giảm theo %</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Giá Trị Khuyến Mãi"
          name="GiaTriKM"
          dependencies={["LoaiKM"]}
          rules={[
            {
              required: true,
              message: "Giá trị khuyến mãi là trường bắt buộc",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const loaiKM = getFieldValue("LoaiKM");
                if (value === undefined)
                  return Promise.reject("Vui lòng nhập giá trị");

                if (value < 0)
                  return Promise.reject("Giá trị không được là số âm");
                if (loaiKM === "percentage") {
                  if (!Number.isInteger(value))
                    return Promise.reject(
                      "Không được nhập số thập phân khi giảm theo kiểu %"
                    );
                  if (value > 100) return Promise.reject("Không lớn hơn 100%");
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="Nhập giá trị khuyến mãi"
          />
        </Form.Item>

        <Form.Item
          label="Ngày Bắt Đầu"
          name="NgayBD"
          rules={[
            { required: true, message: "Ngày bắt đầu là trường bắt buộc" },
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Ngày Kết Thúc"
          name="NgayKT"
          dependencies={["NgayBD"]}
          rules={[
            { required: true, message: "Ngày kết thúc là trường bắt buộc" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const startDate = getFieldValue("NgayBD");
                if (!startDate)
                  return Promise.reject("Vui lòng chọn Ngày Bắt Đầu trước");
                if (value && value.isBefore(startDate, "day")) {
                  return Promise.reject(
                    "Ngày Kết Thúc phải lớn hơn hoặc bằng Ngày Bắt Đầu"
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Trạng Thái"
          name="TrangThai"
          rules={[{ required: true, message: "Trạng thái là trường bắt buộc" }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value={0}>🟡 Chưa bắt đầu</Option>
            <Option value={1}>🔵 Đang diễn ra</Option>
            <Option value={2}>🔴 Đã kết thúc</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm Khuyến Mãi
          </Button>
          <Button
            style={{ marginLeft: "8px" }}
            onClick={() => navigate("/admin/vouchers")}
          >
            Quay Lại
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddPromotion;
