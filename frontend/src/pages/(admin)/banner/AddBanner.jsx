import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Upload,
  Image,
  message,
  Card,
  Typography,
  Space,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { createBanner, fetchBanners, uploadImage } from "../../../service/api";

const { Title } = Typography;

const BannerAdd = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [imageUrl, setImageUrl] = useState("");
  const [existingBanners, setExistingBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const res = await fetchBanners();
        setExistingBanners(res.data.data);
      } catch (error) {
        console.error("Error loading banners:", error);
      }
    };
    loadBanners();
  }, []);

  const handleImageUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await uploadImage(formData);
      const url = response.data.imageUrl;
      setImageUrl(url);
      setValue("imgUrl", url);
      message.success("Tải ảnh thành công");
    } catch (error) {
      message.error("Tải ảnh thất bại");
    }
  };

  const onSubmit = async (data) => {
    const bannerData = {
      ...data,
      imgUrl: imageUrl,
    };

    try {
      setLoading(true);
      await createBanner(bannerData);
      message.success("Thêm banner thành công!");
      navigate("/admin/banners");
    } catch (error) {
      message.error("Thêm banner thất bại!");
      console.error(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <Title level={3} className="text-center text-primary">
        Thêm Banner
      </Title>

      <Card bordered className="shadow">
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Upload hình ảnh */}
          <Form.Item label="Hình ảnh" required>
            <Upload
              accept="image/*"
              showUploadList={false}
              customRequest={handleImageUpload}
            >
              <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
            </Upload>
            {imageUrl && (
              <Image
                src={imageUrl}
                alt="Preview"
                width={200}
                className="mt-3"
                style={{ borderRadius: 8 }}
              />
            )}
            {!imageUrl && (
              <div style={{ color: "red", marginTop: 5 }}>
                {errors.imgUrl?.message}
              </div>
            )}
            <input
              type="hidden"
              {...register("imgUrl", {
                required: "Vui lòng tải lên hình ảnh",
              })}
            />
          </Form.Item>

          {/* Trạng thái */}
          <Form.Item label="Trạng thái">
            <Checkbox {...register("status")}>Kích hoạt</Checkbox>
          </Form.Item>

          {/* Nút hành động */}
          <Form.Item>
            <Space className="w-100 justify-content-between">
              <Link to="/admin/banners">
                <Button icon={<ArrowLeftOutlined />}>Quay lại</Button>
              </Link>
              <Button
                type="primary"
                htmlType="submit"
                icon={<PlusCircleOutlined />}
                loading={loading}
              >
                Thêm
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default BannerAdd;
