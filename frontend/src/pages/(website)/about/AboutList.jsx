import React from "react";

const AboutList = () => {
  return (
    <>
      {/* Giới thiệu MobileStore */}
      <section className="container mx-auto my-10 px-6 text-center">
        <h2 className="text-3xl font-bold">Chào mừng đến với MobileStore</h2>
        <p className="text-lg text-gray-600 mt-2">
          MobileStore là một trang web bán điện thoại trực tuyến do công ty
          MobileStore tạo ra và chi phối...
        </p>
      </section>

      {/* Số liệu thống kê */}
      <section className="container mx-auto text-center my-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: "📱", number: "1,00,000 +", label: "Sản phẩm" },
            { icon: "👥", number: "80,000 +", label: "Khách hàng" },
            { icon: "📍", number: "100 +", label: "Chi nhánh" },
          ].map((item, index) => (
            <div key={index} className="p-6 border rounded-lg shadow-md">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="text-xl font-bold mt-3">{item.number}</h3>
              <p className="text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Nhiệm vụ, tầm nhìn, giá cả */}
      <section className="container mx-auto my-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Nhiệm vụ",
              text: "Mang đến sự dễ dàng và thuận tiện khi khách hàng mua sản phẩm.",
            },
            {
              title: "Tầm nhìn",
              text: "Mở rộng chuỗi cửa hàng ra cả nước, phục vụ cho tất cả khách hàng.",
            },
            {
              title: "Giá cả",
              text: "Giá cả phù hợp với từng sản phẩm. Có dịch vụ giảm giá và miễn phí vận chuyển.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg text-center shadow-md bg-gray-100"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline phát triển */}
      <section className="container mx-auto my-10">
        <h2 className="text-center text-3xl font-bold">
          Thời gian phát triển MobileStore
        </h2>
        <ul className="mt-6 space-y-4">
          {[
            {
              year: "2010 - 2012",
              text: "Xây dựng ý tưởng mở công ty MobileStore.",
            },
            {
              year: "2013 - 2014",
              text: "Công ty MobileStore được thành lập, tìm kiếm khách hàng.",
            },
            { year: "2014 - 2015", text: "Công ty đi vào thời kỳ ổn định." },
            {
              year: "2017 - 2018",
              text: "Mở thêm nhiều chi nhánh và phát triển trang web MobileStore.",
            },
          ].map((item, index) => (
            <li
              key={index}
              className="p-4 border-l-4 border-blue-500 pl-4 bg-gray-50"
            >
              <strong className="text-blue-600">{item.year}:</strong>{" "}
              {item.text}
            </li>
          ))}
        </ul>
      </section>

      {/* Bình luận khách hàng */}
      <section className="container mx-auto my-10">
        <h2 className="text-center text-3xl font-bold">
          Bình luận nổi bật của khách hàng
        </h2>
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          {[
            {
              text: "“Công ty có nhiều loại sản phẩm khác nhau. Giá cả lại rất phù hợp. Tôi rất thích công ty này.”",
              name: "Henry Odom",
            },
            {
              text: "“Tôi thật sự thích công ty này, họ luôn mang đến sự thuận tiện khi tôi mua sản phẩm của họ.”",
              name: "George Walker",
            },
            {
              text: "“Công ty có một đội ngũ phục vụ rất tốt, tư vấn tận tình.”",
              name: "Nguyễn Văn A",
            },
          ].map((review, index) => (
            <div
              key={index}
              className="p-6 border rounded-lg shadow-md bg-gray-100 text-center"
            >
              <p className="text-gray-700">{review.text}</p>
              <h4 className="mt-4 font-bold">{review.name}</h4>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutList;
