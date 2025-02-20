import React from "react";

const Features = () => {
  return (
    <>
      <div className="bg-blue-500 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="flex items-center text-white">
              <div className="bg-white text-blue-500 rounded-full p-6 mr-4">
                <i className="fa fa-credit-card text-4xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Thanh toán an toàn</h3>
                <p className="mt-2 text-sm">
                  Mang đến dịch vụ trải nghiệm thoải mái nhất, an toàn, tiện dụng, Mobistore!
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-center text-white">
              <div className="bg-white text-blue-500 rounded-full p-6 mr-4">
                <i className="fa fa-users text-4xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Phản hồi 24/7</h3>
                <p className="mt-2 text-sm">
                  Trợ giúp liên lạc, tham khảo , tra cứu 24/7!
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-center text-white">
              <div className="bg-white text-blue-500 rounded-full p-6 mr-4">
                <i className="fa fa-rotate-left text-4xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Đổi trả miễn phí</h3>
                <p className="mt-2 text-sm">
                  Miễn phí bảo hành đổi trả lên đến 365 ngày!
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex items-center text-white">
              <div className="bg-white text-blue-500 rounded-full p-6 mr-4">
                <i className="fa fa-dollar text-4xl"></i>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Giá tốt nhất</h3>
                <p className="mt-2 text-sm">
                  Giá thành tốt nhất trong thị trường. Cập nhật sản phẩm 24/7!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Features;
