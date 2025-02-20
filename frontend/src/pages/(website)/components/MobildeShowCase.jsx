import React from "react";

const MobildeShowCase = () => {
  return (
    <>
      <div className="space-medium">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="showcase-block">
                <div className="display-logo ">
                  <a href="#">
                    {" "}
                    <img src="./src/./img/nexus.png" alt />
                  </a>
                </div>
                <div className="showcase-img">
                  <a href="#">
                    {" "}
                    <img src="./src/./img/display_img_1.png" alt />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <div className="showcase-block active">
                <div className="display-logo alignleft">
                  <a href="#">
                    {" "}
                    <img src="./src/./img/iphone.png" alt />
                  </a>
                </div>
                <div className="showcase-img">
                  <a href="#">
                    {" "}
                    <img
                      src="./src/./img/display_img_2.png"
                      alt
                      style={{ paddingLeft: 80 }}
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12">
              <div className="showcase-block ">
                <div className="display-logo ">
                  <a href="#">
                    {" "}
                    <img src="./src/./img/samsung.png" alt />
                  </a>
                </div>
                <div className="showcase-img">
                  <a href="#">
                    <img src="./src/./img/display_img_3.png" alt />{" "}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="showcase-block">
                <div className="display-logo ">
                  <a href="#">
                    <img src="./src/./img/htc.png" alt />
                  </a>
                </div>
                <div className="showcase-img">
                  <a href="#">
                    <img src="./src/./img/display_img_4.png" alt />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="showcase-block">
                <div className="display-logo">
                  <a href="#">
                    {" "}
                    <img src="./src/./img/alcatel.png" alt />
                  </a>
                </div>
                <div className="showcase-img">
                  <a href="#">
                    {" "}
                    <img src="./src/./img/display_img_5.png" alt />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="showcase-block">
                <div className="display-logo ">
                  <a href="#">
                    <img src="./src/./img/pixel.png" alt />
                  </a>
                </div>
                <div className="showcase-img">
                  <a href="#">
                    {" "}
                    <img src="./src/./img/display_img_6.png" alt />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 col-xs-12">
              <div className="showcase-block">
                <div className="display-logo ">
                  <a href="#">
                    {" "}
                    <img src="./src/./img/vivo.png" alt />
                  </a>
                </div>
                <div className="showcase-img">
                  <a href="#">
                    <img src="./src/./img/display_img_7.png" alt />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobildeShowCase;
