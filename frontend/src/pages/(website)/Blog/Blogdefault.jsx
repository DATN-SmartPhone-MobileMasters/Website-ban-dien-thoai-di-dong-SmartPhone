import React from "react";
import { useNavigate } from "react-router-dom";

const posts = [
  {
    title: "Commerce Free Template",
    date: "20 DECEMBER, 2020",
    author: "ADMIN",
    image: "https://picsum.photos/200/300", // Thay bằng link ảnh thực tế
    description:
      "Etiased lorem sapius pharetra edexin fringilam acpurus semrib non magna id ipsum...",
  },
  {
    title: "Online Mobile Store E-Commerce",
    date: "18 THÁNG 11, 2020",
    author: "ADMIN",
    image: "https://picsum.photos/200/300",
    description: "Nullam ac dui ut nisl interdum mattis ut nonese mauris...",
  },
  {
    title: "E-Commerce Free Template",
    date: "18 DECEMBER, 2020",
    author: "ADMIN",
    image: "https://picsum.photos/200/300",
    description:
      "Etiased lorem sapius pharetra edexin fringilam acpurus semrib non magna id ipsum...",
  },
  {
    title: "Online Mobile Shopping",
    date: "15 DECEMBER, 2020",
    author: "ADMIN",
    image: "https://picsum.photos/200/300",
    description:
      "Aenean fringilllaest euismod exdictum viverra interdum malesuadea fameasce...",
  },
  {
    title: "Online Mobile Store",
    date: "16 DECEMBER, 2020",
    author: "ADMIN",
    image: "https://picsum.photos/200/300",
    description:
      "Curabitur auctor lectus magnaa faucibus one mauris finibus...",
  },
  {
    title: "Mobile Phones Online Shopping",
    date: "20 DECEMBER, 2020",
    author: "ADMIN",
    image: "https://picsum.photos/200/300",
    description:
      "Etiased lorem sapius pharetra edexin fringilam acpurus semrib non magna id ipsum...",
  },
];

const BlogGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, index) => (
            <div key={index} className="bg-white p-5 shadow-lg rounded-lg">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg"
              />
              <h3 className="mt-4 text-lg font-semibold">{post.title}</h3>
              <p className="text-gray-500 text-sm">
                {post.date} | BY {post.author}
              </p>
              <p className="mt-2 text-gray-700">{post.description}</p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                onClick={() => navigate(`/blog/sigle`)}
              >
                ĐỌC THÊM
              </button>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6">
          <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-l">
            TRANG TRƯỚC
          </button>
          <button className="px-3 py-1 bg-orange-500 text-white mx-1">1</button>
          <button className="px-3 py-1 bg-gray-300 text-gray-700 mx-1">
            2
          </button>
          <button className="px-3 py-1 bg-gray-300 text-gray-700 mx-1">
            3
          </button>
          <button className="px-3 py-1 bg-gray-300 text-gray-700 rounded-r">
            TRANG SAU
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogGrid;
