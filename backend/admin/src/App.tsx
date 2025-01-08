import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/LayoutAdmin";
import DashBoard from "./pages/DashBoard";
import Products from "./pages/Products/ProductList";
import BrandList from "./pages/Brands/BrandList";
import BrandAdd from "./pages/Brands/BrandAdd";
function App() {
  const configRouter = createBrowserRouter([
    {
      element: <LayoutAdmin />,
      children: [
        {
          path: "/",
          element: <DashBoard />,
        },
        {
          path: "/products",
          element: <Products />,
        },
        // Quản lý thương hiệu
        {
          path: "/brands",
          element: <BrandList />,//danh sách thương hiệu
        },
        {
          path: "/brands/add",
          element: <BrandAdd />,//thêm thương hiệu
        },
      ],
    },
  ]);
  return (
    <>
      <RouterProvider router={configRouter} />
    </>
  );
}

export default App;
