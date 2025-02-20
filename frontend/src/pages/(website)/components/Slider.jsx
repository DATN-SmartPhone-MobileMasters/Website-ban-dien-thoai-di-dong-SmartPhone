import React, { useState } from 'react';

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Dữ liệu cho slider (có thể thay đổi hình ảnh hoặc nội dung khác)
  const slides = [
    { id: 1, title: 'Red Mi Y1', price: '$138.99', img: './src/./img/slider_1.jpg' },
    { id: 2, title: 'Google Pixel 2', price: '$938.10', img: './src/./img/slider_2.jpg' },
    { id: 3, title: 'iPhone 8 Plus', price: '$759.64', img: './src/./img/slider_3.jpg' },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-screen">
      {/* Hiển thị ảnh */}
      <div className="h-full overflow-hidden">
        <img
          src={slides[currentIndex].img}
          alt={slides[currentIndex].title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Nội dung Slider */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center text-white bg-black bg-opacity-10">
        <h2 className="text-4xl font-bold mb-2">{slides[currentIndex].title}</h2>
        <p className="text-2xl mb-4">{slides[currentIndex].price}</p>
        <button className="bg-orange-500 px-6 py-2 rounded-lg text-xl">Buy Now</button>
      </div>

      {/* Nút điều hướng */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-4xl cursor-pointer">
        <button onClick={prevSlide}>{"<"}</button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-4xl cursor-pointer">
        <button onClick={nextSlide}>{">"}</button>
      </div>
    </div>
  );
};

export default Slider;
