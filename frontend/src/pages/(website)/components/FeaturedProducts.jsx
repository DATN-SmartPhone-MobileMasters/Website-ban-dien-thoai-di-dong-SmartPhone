import React from "react";

const FeaturedProducts = () => {
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="box">
              <div className="box-head">
                <h3 className="head-title">Đang khuyến mãi</h3>
              </div>
              <div className="box-body">
                <div className="row">
                  {/* product */}
                  <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="product-block">
                      <div className="product-img">
                        <img src="images/product_img_3.png" alt />
                      </div>
                      <div className="product-content">
                        <h5>
                          <a href="#" className="product-title">
                            Samsung Galaxy Note 8
                          </a>
                        </h5>
                        <div className="product-meta">
                          <a href="#" className="product-price">
                            $1500
                          </a>
                          <a href="#" className="discounted-price">
                            <strike>$2000</strike>
                          </a>
                          <span className="offer-price">40%off</span>
                        </div>
                        <div className="shopping-btn">
                          <a href="#" className="product-btn btn-like">
                            <i className="fa fa-heart" />
                          </a>
                          <a href="#" className="product-btn btn-cart">
                            <i className="fa fa-shopping-cart" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /.product */}
                  {/* product */}
                  <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="product-block">
                      <div className="product-img">
                        <img src="images/product_img_4.png" alt />
                      </div>
                      <div className="product-content">
                        <h5>
                          <a href="#" className="product-title">
                            Vivo V5 Plus <strong>(Matte Black)</strong>
                          </a>
                        </h5>
                        <div className="product-meta">
                          <a href="#" className="product-price">
                            $1500
                          </a>
                          <a href="#" className="discounted-price">
                            <strike>$2000</strike>
                          </a>
                          <span className="offer-price">15%off</span>
                        </div>
                        <div className="shopping-btn">
                          <a href="#" className="product-btn btn-like">
                            <i className="fa fa-heart" />
                          </a>
                          <a href="#" className="product-btn btn-cart">
                            <i className="fa fa-shopping-cart" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /.product */}
                  {/* product */}
                  <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="product-block">
                      <div className="product-img">
                        <img src="images/product_img_1.png" alt />
                      </div>
                      <div className="product-content">
                        <h5>
                          <a href="#" className="product-title">
                            Google Pixel <strong>(128GB, Black)</strong>
                          </a>
                        </h5>
                        <div className="product-meta">
                          <a href="#" className="product-price">
                            $1100
                          </a>
                          <a href="#" className="discounted-price">
                            <strike>$1400</strike>
                          </a>
                          <span className="offer-price">20%off</span>
                        </div>
                        <div className="shopping-btn">
                          <a href="#" className="product-btn btn-like">
                            <i className="fa fa-heart" />
                          </a>
                          <a href="#" className="product-btn btn-cart">
                            <i className="fa fa-shopping-cart" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /.product */}
                  {/* product */}
                  <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
                    <div className="product-block">
                      <div className="product-img">
                        <img src="images/product_img_2.png" alt />
                      </div>
                      <div className="product-content">
                        <h5>
                          <a href="#" className="product-title">
                            HTC U Ultra <strong>(64GB, Blue)</strong>
                          </a>
                        </h5>
                        <div className="product-meta">
                          <a href="#" className="product-price">
                            $1200
                          </a>
                          <a href="#" className="discounted-price">
                            <strike>$1700</strike>
                          </a>
                          <span className="offer-price">10%off</span>
                        </div>
                        <div className="shopping-btn">
                          <a href="#" className="product-btn btn-like">
                            <i className="fa fa-heart" />
                          </a>
                          <a href="#" className="product-btn btn-cart">
                            <i className="fa fa-shopping-cart" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* /.product */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedProducts;
