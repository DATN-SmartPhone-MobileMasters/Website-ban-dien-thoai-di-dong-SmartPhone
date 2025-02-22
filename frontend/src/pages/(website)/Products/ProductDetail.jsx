import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Rate } from "antd";

const ProductDetail = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const [activeSection, setActiveSection] = useState("product");

  // Function to switch sections
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };
  return (
    <>
      <div>
        {/* page-header */}
        <div className="bg-gray-100 py-6">
          <div className="container mx-auto">
            <div className="flex justify-between">
              <div className="w-full">
                <div className="text-gray-600">
                  <ol className="flex space-x-2 text-sm">
                    <li>
                      <a href="#" className="text-blue-500 hover:text-blue-700">
                        Trang chủ
                      </a>
                    </li>
                    <li className="text-gray-500">Chi tiết sản phẩm</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* /.page-header */}

        {/* product-single */}
        <div className="content">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap">
              <div className="w-full md:w-1/2 lg:w-2/12">
                <ul id="demo1_thumbs" className="slideshow_thumbs">
                  <li>
                    <Link to="https://www.xtmobile.vn/vnt_upload/product/10_2021/thumbs/600_iphone_13_256gb_xanh.jpg">
                      <div className="thumb-img">
                        <img
                          src="https://www.xtmobile.vn/vnt_upload/product/10_2021/thumbs/600_iphone_13_256gb_xanh.jpg"
                          alt="iPhone 13 xanh"
                        />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="https://www.xtmobile.vn/vnt_upload/product/10_2021/thumbs/600_iphone_13_256gb_trang.jpg">
                      <div className="thumb-img">
                        <img
                          src="https://www.xtmobile.vn/vnt_upload/product/10_2021/thumbs/600_iphone_13_256gb_trang.jpg"
                          alt="iPhone 13 trắng"
                        />
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="https://www.xtmobile.vn/vnt_upload/product/10_2021/thumbs/600_iphone_13_256gb_hong.jpg">
                      <div className="thumb-img">
                        <img
                          src="https://www.xtmobile.vn/vnt_upload/product/10_2021/thumbs/600_iphone_13_256gb_hong.jpg"
                          alt="iPhone 13 hồng"
                        />
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="w-full md:w-1/2 lg:w-4/12">
                <div id="slideshow" />
                <img
                  src="https://www.xtmobile.vn/vnt_upload/product/10_2021/thumbs/600_iphone_13_256gb_xanh.jpg"
                  alt="iPhone 13"
                />
              </div>

              <div className="w-full md:w-1/2 lg:w-6/12">
                <div className="product-single">
                  <h2 className="text-xl font-semibold">
                    iPhone 13 256GB Chính hãng (VN/A)
                  </h2>
                  <div className="product-rating flex items-center">
                    {[...Array(4)].map((_, index) => (
                      <i key={index} className="fa fa-star text-yellow-400" />
                    ))}
                    <i className="fa fa-star-o text-gray-400" />
                    <span className="text-secondary ml-2">(12 đánh giá)</span>
                  </div>
                  <p className="product-price text-2xl mt-2">
                    25.350.000đ
                    <strike className="text-gray-400 ml-2 text-base">
                      27.990.000đ
                    </strike>
                  </p>

                  <div className="box-capacity my-4">
                    <Link to="#" className="text-blue-500 mr-2">
                      <span className="capacity">128GB</span>
                    </Link>
                    <Link to="#" className="text-blue-500 font-semibold mr-2">
                      <span className="capacity">256GB</span>
                    </Link>
                    <Link to="#" className="text-blue-500 mr-2">
                      <span className="capacity">512GB</span>
                    </Link>
                  </div>

                  <div className="color-phone my-4">
                    <Link to="#" className="text-blue-500 font-semibold mr-2">
                      <span>Vàng đồng</span>
                    </Link>
                    <Link to="#" className="text-blue-500 mr-2">
                      <span>Xám</span>
                    </Link>
                    <Link to="#" className="text-blue-500 mr-2">
                      <span>Bạc</span>
                    </Link>
                  </div>

                  <div className="product-quantity mt-4">
                    <h4 className="text-lg">Số lượng</h4>
                    <div className="quantity mb-4 flex items-center">
                      <button className="btn-quantity decrease-quantity px-4 py-2 bg-gray-200 rounded-full">
                        -
                      </button>
                      <input
                        type="number"
                        max={10}
                        min={1}
                        name="quantity"
                        defaultValue={1}
                        className="quantity-input mx-2 w-16 text-center border rounded"
                      />
                      <button className="btn-quantity increase-quantity px-4 py-2 bg-gray-200 rounded-full">
                        +
                      </button>
                    </div>
                    <span className="rest-quantity">5 sản phẩm có sẵn</span>
                  </div>

                  <div className="buttons flex items-center mt-4">
                    <button className="bg-blue-500 text-white py-2 px-4 rounded-full mr-4">
                      Mua Ngay
                    </button>
                    <button className="bg-green-500 text-white py-2 px-4 rounded-full">
                      <i className="fa fa-shopping-cart mr-2" /> Thêm vào giỏ
                      hàng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-wrap">
              <div className="w-full">
                <div className="box-head scroll-nav">
                  <div className="head-title">
                    {/* Section navigation links */}
                    <Link
                      to="#product"
                      className={`page-scroll text-blue-500 hover:text-blue-700 ${
                        activeSection === "product" ? "font-bold" : ""
                      }`}
                      onClick={() => handleSectionChange("product")}
                    >
                      Mô tả sản phẩm
                    </Link>
                    <Link
                      to="#rating"
                      className={`page-scroll text-blue-500 hover:text-blue-700 ${
                        activeSection === "rating" ? "font-bold" : ""
                      }`}
                      onClick={() => handleSectionChange("rating")}
                    >
                      Đánh giá và nhận xét
                    </Link>
                    <Link
                      to="#review"
                      className={`page-scroll text-blue-500 hover:text-blue-700 ${
                        activeSection === "review" ? "font-bold" : ""
                      }`}
                      onClick={() => handleSectionChange("review")}
                    >
                      Thêm nhận xét
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional content rendering based on active section */}
            <div className="flex flex-wrap mt-8">
              <div className="w-full">
                {activeSection === "product" && (
                  <div className="description-details">
                    <div className="description-left">
                      <h2 className="text-2xl font-semibold">
                        Đặc điểm nổi bật
                      </h2>
                      {/* Add product description content here */}
                      <p>
                        Đây là mô tả chi tiết về sản phẩm, thông tin kỹ thuật và
                        các đặc điểm nổi bật.
                      </p>
                    </div>
                  </div>
                )}

                {activeSection === "rating" && (
                  <div className="box container-rating-review p-4 border rounded-lg bg-white shadow-md">
                    <h3 className="text-2xl font-semibold mb-4">
                      Đánh giá và nhận xét
                    </h3>

                    {/* Hiển thị đánh giá tổng thể */}
                    <div className="overall-rating flex items-center mb-4">
                      <span className="rating-number text-3xl font-bold mr-2">
                        4
                      </span>
                      <Rate allowHalf value={4} disabled />
                      <span className="total-reviews text-gray-600 ml-2">
                        12 nhận xét
                      </span>
                    </div>

                    {/* Phân loại đánh giá */}
                    <div className="rating-breakdown mb-4">
                      <div className="rating-row flex items-center mb-2">
                        <Rate allowHalf value={5} disabled />
                        <span className="count text-gray-600 ml-2">12</span>
                      </div>
                      <div className="rating-row flex items-center mb-2">
                        <Rate allowHalf value={4} disabled />
                        <span className="count text-gray-600 ml-2">0</span>
                      </div>
                      <div className="rating-row flex items-center mb-2">
                        <Rate allowHalf value={3} disabled />
                        <span className="count text-gray-600 ml-2">0</span>
                      </div>
                      <div className="rating-row flex items-center mb-2">
                        <Rate allowHalf value={2} disabled />
                        <span className="count text-gray-600 ml-2">0</span>
                      </div>
                      <div className="rating-row flex items-center mb-2">
                        <Rate allowHalf value={1} disabled />
                        <span className="count text-gray-600 ml-2">0</span>
                      </div>
                    </div>

                    {/* Danh sách nhận xét */}
                    <div className="reviews">
                      <div className="review p-4 mb-4 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="review-header flex items-center mb-2">
                          <span className="reviewer-name font-bold mr-2">
                            Nika Nguyen
                          </span>
                          <Rate allowHalf value={4} disabled />
                        </div>
                        <p className="review-text text-gray-600">
                          Giao hàng siêu đúng hẹn, hàng cũng được đóng gói cẩn
                          thận. Hiện tại mình xài được vài bữa thì không bị vấn
                          đề gì. Hàng của shopdunk thì không lo về chất lượng.
                        </p>
                      </div>
                      <div className="review p-4 mb-4 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="review-header flex items-center mb-2">
                          <span className="reviewer-name font-bold mr-2">
                            Lưu Tee
                          </span>
                          <Rate allowHalf value={4} disabled />
                        </div>
                        <p className="review-text text-gray-600">
                          Mặc dù vận chuyển lâu do lỗi, nhưng shop vẫn hỗ trợ
                          mình rất nhiệt tình.
                        </p>
                      </div>
                      <div className="review p-4 mb-4 border rounded-lg bg-gray-50 shadow-sm">
                        <div className="review-header flex items-center mb-2">
                          <span className="reviewer-name font-bold mr-2">
                            William Cassidy
                          </span>
                          <Rate allowHalf value={5} disabled />
                        </div>
                        <p className="review-text text-gray-600">
                          Sản phẩm rất tốt vì là lần đầu tôi mua trên mạng đt
                          nên thấy khá lo lắng nhưng khi nhận dc hàng thì tôi
                          lại thấy tốt hơn mong đợi của mình chúc Shop làm ăn
                          mua may bán đắt.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "review" && (
                  <div id="review">
                    <div className="box">
                      <h3 className="text-2xl font-semibold">
                        Đánh giá và nhận xét của bạn
                      </h3>
                      <div className="review-form">
                        <form>
                          {/* Add review form here */}
                          <div className="form-group">
                            <input
                              type="text"
                              placeholder="Nhập tên của bạn"
                              className="form-input w-full border rounded px-4 py-2"
                            />
                          </div>
                          <div className="form-group">
                            <textarea
                              placeholder="Nhập bình luận của bạn"
                              className="form-textarea w-full border rounded px-4 py-2"
                              rows="4"
                            />
                          </div>
                          <button className="btn btn-primary mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Gửi đánh giá
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* /.product-single */}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
