import React from "react";

const LatestProducts = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="w-full">
        <div className="box">
          <div className="box-head mb-6">
            <h3 className="text-xl font-semibold">Sản phẩm mới nhất</h3>
          </div>
          <div className="box-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {/* Product 1 */}
              <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                <div className="product-img mb-4">
                  <img
                    src="./src/./img/product_img_1.png"
                    alt="Google Pixel"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="product-content flex-grow">
                  <h5>
                    <a href="#" className="product-title text-lg font-semibold">
                      Google Pixel <strong>(128GB, Black)</strong>
                    </a>
                  </h5>
                  <div className="product-meta my-2">
                    <a href="#" className="product-price text-lg font-semibold text-orange-500">
                      $1100
                    </a>
                    <a href="#" className="discounted-price text-gray-500 line-through ml-2">
                      $1400
                    </a>
                    <span className="offer-price text-red-500 text-sm ml-2">20%off</span>
                  </div>
                </div>
                <div className="shopping-btn flex space-x-4 mt-4">
                  <a href="#" className="product-btn btn-like text-red-500 hover:text-red-700">
                    <i className="fa fa-heart" />
                  </a>
                  <a href="#" className="product-btn btn-cart text-blue-500 hover:text-blue-700">
                    <i className="fa fa-shopping-cart" />
                  </a>
                </div>
              </div>

              {/* Product 2 */}
              <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                <div className="product-img mb-4">
                  <img
                    src="./src/./img/product_img_2.png"
                    alt="HTC U Ultra"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="product-content flex-grow">
                  <h5>
                    <a href="#" className="product-title text-lg font-semibold">
                      HTC U Ultra <strong>(64GB, Blue)</strong>
                    </a>
                  </h5>
                  <div className="product-meta my-2">
                    <a href="#" className="product-price text-lg font-semibold text-orange-500">
                      $1200
                    </a>
                    <a href="#" className="discounted-price text-gray-500 line-through ml-2">
                      $1700
                    </a>
                    <span className="offer-price text-red-500 text-sm ml-2">10%off</span>
                  </div>
                </div>
                <div className="shopping-btn flex space-x-4 mt-4">
                  <a href="#" className="product-btn btn-like text-red-500 hover:text-red-700">
                    <i className="fa fa-heart" />
                  </a>
                  <a href="#" className="product-btn btn-cart text-blue-500 hover:text-blue-700">
                    <i className="fa fa-shopping-cart" />
                  </a>
                </div>
              </div>

              {/* Product 3 */}
              <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                <div className="product-img mb-4">
                  <img
                    src="./src/./img/product_img_3.png"
                    alt="Samsung Galaxy Note 8"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="product-content flex-grow">
                  <h5>
                    <a href="#" className="product-title text-lg font-semibold">
                      Samsung Galaxy Note 8
                    </a>
                  </h5>
                  <div className="product-meta my-2">
                    <a href="#" className="product-price text-lg font-semibold text-orange-500">
                      $1500
                    </a>
                    <a href="#" className="discounted-price text-gray-500 line-through ml-2">
                      $2000
                    </a>
                    <span className="offer-price text-red-500 text-sm ml-2">40%off</span>
                  </div>
                </div>
                <div className="shopping-btn flex space-x-4 mt-4">
                  <a href="#" className="product-btn btn-like text-red-500 hover:text-red-700">
                    <i className="fa fa-heart" />
                  </a>
                  <a href="#" className="product-btn btn-cart text-blue-500 hover:text-blue-700">
                    <i className="fa fa-shopping-cart" />
                  </a>
                </div>
              </div>

              {/* Product 4 */}
              <div className="product-block border p-4 rounded-lg shadow-lg flex flex-col h-full">
                <div className="product-img mb-4">
                  <img
                    src="./src/./img/product_img_4.png"
                    alt="Vivo V5 Plus"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="product-content flex-grow">
                  <h5>
                    <a href="#" className="product-title text-lg font-semibold">
                      Vivo V5 Plus <strong>(Matte Black)</strong>
                    </a>
                  </h5>
                  <div className="product-meta my-2">
                    <a href="#" className="product-price text-lg font-semibold text-orange-500">
                      $1500
                    </a>
                    <a href="#" className="discounted-price text-gray-500 line-through ml-2">
                      $2000
                    </a>
                    <span className="offer-price text-red-500 text-sm ml-2">15%off</span>
                  </div>
                </div>
                <div className="shopping-btn flex space-x-4 mt-4">
                  <a href="#" className="product-btn btn-like text-red-500 hover:text-red-700">
                    <i className="fa fa-heart" />
                  </a>
                  <a href="#" className="product-btn btn-cart text-blue-500 hover:text-blue-700">
                    <i className="fa fa-shopping-cart" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestProducts;
