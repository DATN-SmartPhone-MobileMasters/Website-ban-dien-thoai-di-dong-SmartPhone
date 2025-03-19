import React, { useState, useEffect } from "react";

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slides = [
    { id: 1, img: "./src/img/banner/banner1.png" },
    { id: 2, img: "./src/img/banner/banner2.png" },
    { id: 3, img: "./src/img/banner/banner3.png" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000); // Chạy tự động mỗi 5 giây
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  return (
    <div className="relative w-full h-100 overflow-hidden rounded-lg shadow-lg">
      {/* Hiển thị ảnh */}
      <img src={slides[currentIndex].img} className="w-full h-full object-cover transition-transform duration-500" />
      
      {/* Nút điều hướng */}
      <button onClick={prevSlide} className="absolute top-1/2 left-4 transform -translate-y-1/2 text-black text-4xl cursor-pointer bg-white p-2 rounded-full shadow-lg">&#8249;</button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 transform -translate-y-1/2 text-black text-4xl cursor-pointer bg-white p-2 rounded-full shadow-lg">&#8250;</button>
      
      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <div key={index} className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'} transition-all`} />
        ))}
      </div>
    </div>
  );
};

export default Slider;
