import React from "react";
import LatestProducts from "./components/LatestProducts";
import SellerProducts from "./components/SellerProducts";
import Features from "./components/Features";
import Slider from "./components/Slider";
import MobileShowcase from "./components/MobileShowCase";

const HomePage = () => {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 px-10">
      {/* Sidebar */}
      <aside className="w-full md:w-[250px] p-4 flex justify-center md:justify-start">
        <MobileShowcase />
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Slider */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <Slider />
        </div>
        
        {/* Latest Products */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <LatestProducts />
        </div>
        
        {/* Seller Products */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <SellerProducts />
        </div>
        
        {/* Features */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <Features />
        </div>
      </main>
    </div>
  );
};

export default HomePage;