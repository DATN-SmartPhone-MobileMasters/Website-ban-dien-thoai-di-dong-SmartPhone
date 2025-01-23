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
import BrandList from "./pages/(admin)/brands/BrandList";
import BrandAdd from "./pages/(admin)/brands/BrandAdd";
import BrandEdit from "./pages/(admin)/brands/BrandEdit";
import BrandDetail from "./pages/(admin)/brands/BrandDetail";
import UserList from "./pages/(admin)/User/UserList";
import UserDetails from './pages/(admin)/User/UserDetails';
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
        {
          path: "/brands",
          element: <BrandList />,
        },
        {
          path: "/brands/add",
          element: <BrandAdd />,
        },
        {
          path: "/brands/edit/:id",
          element: <BrandEdit />,
        },
        {
          path: "/brands/detail/:id",
          element: <BrandDetail />,
        },
        {
          path: "/accounts",
          element: <UserList />,
        },
        {
          path: "/accounts/:id",
          element: <UserDetails />,
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
