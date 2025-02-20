import React from "react";

const SellerProducts = () => {
  return (
    <>
      <div className="container mx-auto p-4">
        <div className="w-full">
          <div className="box">
            <div className="box-head mb-6">
              <h3 className="text-xl font-semibold">Sản phẩm bán chạy</h3>
            </div>
            <div className="box-body">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Product 1 */}
                <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                  <div className="product-img mb-4">
                    <img
                      src="./src/./img/product_img_5.png"
                      alt="Apple iPhone 6"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <div className="product-content">
                    <h5>
                      <a href="#" className="product-title text-lg font-medium">
                        Apple iPhone 6 <strong>(32 GB, Gold)</strong>
                      </a>
                    </h5>
                    <div className="product-meta flex items-center space-x-2 my-2">
                      <a
                        href="#"
                        className="product-price text-xl text-orange-500"
                      >
                        $1700
                      </a>
                      <a
                        href="#"
                        className="discounted-price text-gray-500 line-through"
                      >
                        $2000
                      </a>
                      <span className="offer-price text-red-500 text-sm">
                        20% off
                      </span>
                    </div>
                    <div className="shopping-btn flex items-center space-x-2 mt-4">
                      <a
                        href="#"
                        className="product-btn btn-like text-red-500 hover:text-red-700"
                      >
                        <i className="fa fa-heart" />
                      </a>
                      <a
                        href="#"
                        className="product-btn btn-cart text-blue-500 hover:text-blue-700"
                      >
                        <i className="fa fa-shopping-cart" />
                      </a>
                    </div>
                  </div>
                </div>
                {/* Product 2 */}
                <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                  <div className="product-img mb-4">
                    <img
                      src="./src/./img/product_img_6.png"
                      alt="Apple iPhone 7"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <div className="product-content">
                    <h5>
                      <a href="#" className="product-title text-lg font-medium">
                        Apple iPhone 7 <strong>(32 GB, Black)</strong>
                      </a>
                    </h5>
                    <div className="product-meta flex items-center space-x-2 my-2">
                      <a
                        href="#"
                        className="product-price text-xl text-orange-500"
                      >
                        $1700
                      </a>
                      <a
                        href="#"
                        className="discounted-price text-gray-500 line-through"
                      >
                        $2000
                      </a>
                      <span className="offer-price text-red-500 text-sm">
                        20% off
                      </span>
                    </div>
                    <div className="shopping-btn flex items-center space-x-2 mt-4">
                      <a
                        href="#"
                        className="product-btn btn-like text-red-500 hover:text-red-700"
                      >
                        <i className="fa fa-heart" />
                      </a>
                      <a
                        href="#"
                        className="product-btn btn-cart text-blue-500 hover:text-blue-700"
                      >
                        <i className="fa fa-shopping-cart" />
                      </a>
                    </div>
                  </div>
                </div>
                {/* Product 3 */}
                <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                  <div className="product-img mb-4">
                    <img
                      src="./src/./img/product_img_7.png"
                      alt="Apple iPhone 6S"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <div className="product-content">
                    <h5>
                      <a href="#" className="product-title text-lg font-medium">
                        Apple iPhone 6S <strong>(32 GB, Gold)</strong>
                      </a>
                    </h5>
                    <div className="product-meta flex items-center space-x-2 my-2">
                      <a
                        href="#"
                        className="product-price text-xl text-orange-500"
                      >
                        $1700
                      </a>
                      <a
                        href="#"
                        className="discounted-price text-gray-500 line-through"
                      >
                        $2000
                      </a>
                      <span className="offer-price text-red-500 text-sm">
                        20% off
                      </span>
                    </div>
                    <div className="shopping-btn flex items-center space-x-2 mt-4">
                      <a
                        href="#"
                        className="product-btn btn-like text-red-500 hover:text-red-700"
                      >
                        <i className="fa fa-heart" />
                      </a>
                      <a
                        href="#"
                        className="product-btn btn-cart text-blue-500 hover:text-blue-700"
                      >
                        <i className="fa fa-shopping-cart" />
                      </a>
                    </div>
                  </div>
                </div>
                {/* Product 4 */}
                <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                  <div className="product-img mb-4">
                    <img
                      src="./src/./img/product_img_8.png"
                      alt="Apple iPhone X"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <div className="product-content">
                    <h5>
                      <a href="#" className="product-title text-lg font-medium">
                        Apple iPhone X <strong>(64GB, Grey)</strong>
                      </a>
                    </h5>
                    <div className="product-meta flex items-center space-x-2 my-2">
                      <a
                        href="#"
                        className="product-price text-xl text-orange-500"
                      >
                        $1700
                      </a>
                      <a
                        href="#"
                        className="discounted-price text-gray-500 line-through"
                      >
                        $2000
                      </a>
                      <span className="offer-price text-red-500 text-sm">
                        20% off
                      </span>
                    </div>
                    <div className="shopping-btn flex items-center space-x-2 mt-4">
                      <a
                        href="#"
                        className="product-btn btn-like text-red-500 hover:text-red-700"
                      >
                        <i className="fa fa-heart" />
                      </a>
                      <a
                        href="#"
                        className="product-btn btn-cart text-blue-500 hover:text-blue-700"
                      >
                        <i className="fa fa-shopping-cart" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerProducts;
