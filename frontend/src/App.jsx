import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";
import ProductsList from "./pages/(admin)/products/ProductsList";
import ProductsEdit from "./pages/(admin)/products/ProductsEdit";
import ProductsAdd from "./pages/(admin)/products/ProductsAdd";
import ProductsDetail from "./pages/(admin)/products/ProductsDetail";
import CategoryList from "./pages/(admin)/categorys/CategoryList";
import CategoryAdd from "./pages/(admin)/categorys/CategoryAdd";
import CategoryUpdate from "./pages/(admin)/categorys/CategoryUpdate";
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
          path: "/categorys",
          element: <CategoryList />,
        },
        {
          path: "/categorys/addcategory",
          element: <CategoryAdd />,
        },
        {
          path: "/categorys/update/:id",
          element: <CategoryUpdate />,
        },
        {
          path: "/products",
          element: <ProductsList />,
        },
        {
          path: "/products/edit/:id",
          element: <ProductsEdit />,
        },

        {
          path: "/products/add",
          element: <ProductsAdd />,
        },
        {
          path: "/products/detail/:id",
          element: <ProductsDetail />,
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
