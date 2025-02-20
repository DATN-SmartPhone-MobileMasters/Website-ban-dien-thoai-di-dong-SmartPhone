import React from "react";
import MobildeShowCase from "./components/MobildeShowCase";
import LatestProducts from "./components/LatestProducts";
import SellerProducts from "./components/SellerProducts";
import Features from "./components/Features";
import Slider from "./components/Slider";

const HomePage = () => {
  return (
    <>
      {/* slider */}
      <Slider />
      {/* /.slider */}
      {/* mobile showcase */}
      <MobildeShowCase />
      {/* /.mobile showcase */}
      {/* latest products */}
      <LatestProducts />
      {/* /.latest products */}
      {/* seller products */}
      <SellerProducts />
      {/* /.seller products */}
      {/* featured products */}
      {/* <FeaturedProducts/> */}
      {/* /.featured products */}
      {/* features */}
      <Features />
      {/* /.features */}
    </>
  );
};

export default HomePage;
