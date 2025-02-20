import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Google Pixel (128GB, Black)",
    image: "./src/./img/product_img_1.png",
    price: 1100,
    oldPrice: 1400,
    discount: "20% off",
  },
  {
    id: 2,
    name: "HTC U Ultra (64GB, Blue)",
    image: "./src/./img/product_img_2.png",
    price: 1200,
    oldPrice: 1700,
    discount: "10% off",
  },
  {
    id: 3,
    name: "Samsung Galaxy Note 8",
    image: "./src/./img/product_img_3.png",
    price: 1500,
    oldPrice: 2000,
    discount: "40% off",
  },
  {
    id: 4,
    name: "Vivo V5 Plus (Matte Black)",
    image: "./src/./img/product_img_4.png",
    price: 1500,
    oldPrice: 2000,
    discount: "15% off",
  },
];

const LatestProducts = () => {
  return (
    <div className="container mx-auto p-4">
      <h3 className="text-xl font-semibold text-center mb-6">Sản phẩm mới nhất</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border p-4 rounded-lg shadow-lg flex flex-col h-full bg-white">
            <div className="flex justify-center">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
            </div>
            <div className="text-center mt-4 flex-grow">
              <h5 className="text-lg font-semibold">
                <Link to={`/product/${product.id}`} className="hover:text-blue-500">
                  {product.name}
                </Link>
              </h5>
              <div className="mt-2">
                <span className="text-lg font-bold text-orange-500">${product.price}</span>
                <span className="text-sm text-gray-500 line-through ml-2">${product.oldPrice}</span>
              </div>
              <span className="text-sm text-red-500">{product.discount}</span>
            </div>
            <div className="flex justify-center mt-4 space-x-3">
              <button className="text-red-500 hover:text-red-700">
                <i className="fa fa-heart text-xl"></i>
              </button>
              <button className="text-blue-500 hover:text-blue-700">
                <i className="fa fa-shopping-cart text-xl"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestProducts;
