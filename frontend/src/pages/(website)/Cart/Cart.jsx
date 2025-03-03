import React from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-4/5 mx-auto">
      <div className="mb-6 border-b pb-4 flex items-center justify-center flex-col ">
        <h2 className="text-2xl font-bold">Giỏ Hàng</h2>
        <p>
          <span className="text-blue-500 font-semibold">2</span> sản phẩm trong
          giỏ hàng của bạn
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3"></th>
              <th className="p-3 text-left">Sản phẩm</th>
              <th className="p-3">Đơn giá</th>
              <th className="p-3 text-center">Số lượng</th>
              <th className="p-3">Thành tiền</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: 1,
                name: "iPhone 13 Pro 128GB",
                color: "Đỏ",
                price: "30.750.000đ",
                image: "images/iPhone_13.jpg",
              },
              {
                id: 2,
                name: "iPhone 11 Pro 128GB",
                color: "Xanh",
                price: "17.000.000đ",
                image: "images/iphone11.png",
              },
            ].map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-3 text-center">
                  <input type="checkbox" className="form-checkbox" />
                </td>
                <td className="p-3 flex items-center space-x-3">
                  <img
                    src={item.image}
                    alt=""
                    className="w-16 h-16 object-cover"
                  />
                  <div>
                    <p>{item.name}</p>
                    <p className="text-gray-500">Màu sắc: {item.color}</p>
                  </div>
                </td>
                <td className="p-3 ">{item.price}</td>
                <td className="p-3 ">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="px-3 py-1 bg-gray-300 rounded">-</button>
                    <input
                      type="number"
                      max="10"
                      min="1"
                      defaultValue="1"
                      className="w-12 text-center border rounded"
                    />
                    <button className="px-3 py-1 bg-gray-300 rounded">+</button>
                  </div>
                </td>
                <td className="p-3  text-red-500">{item.price}</td>
                <td className="p-3  text-gray-500 cursor-pointer">
                  <i className="far fa-trash-alt"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap justify-between items-center mt-6">
        <Link className="text-blue-500" to="/products">
          <i className="fas fa-long-arrow-alt-left"></i> Tiếp tục mua hàng
        </Link>

        <div className="bg-gray-100 p-4 rounded-lg w-full md:w-1/3 mt-4 md:mt-0">
          <div className="mb-4 flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l"
              placeholder="Nhập mã ưu đãi"
            />
            <button className="px-4 bg-blue-500 text-white rounded-r">
              Áp dụng
            </button>
          </div>
          <ul>
            <li className="flex justify-between border-b py-2">
              <span className="text-gray-600">Tạm tính</span>
              <span>47.750.000đ</span>
            </li>
            <li className="flex justify-between py-2">
              <span className="text-gray-600">Giảm giá</span>
              <span>0đ</span>
            </li>
          </ul>
          <div className="flex justify-between font-bold text-red-500 py-2">
            <span>Tổng cộng</span>
            <span>47.750.000đ</span>
          </div>
        </div>
      </div>
      <div className="flex mt-3 justify-end mr-4">
        <Link
          className="text-white mr-3 px-6 py-2 bg-green-500 rounded hover:transition duration-300 ease-in-out"
          to="/products"
        >
          Mua hàng
        </Link>
      </div>
    </div>
  );
};

export default Cart;
