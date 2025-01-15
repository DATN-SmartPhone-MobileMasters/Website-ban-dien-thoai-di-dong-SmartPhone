import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";
<<<<<<< HEAD
import CategoryList from "./pages/(admin)/categorys/CategoryList";
import AddCategory from "./pages/(admin)/categorys/AddCategory";
import UpdateCategory from "./pages/(admin)/categorys/UpdateCategory";

import ProductsList from "./pages/(admin)/products/ProductsList";
import ProductsEdit from "./pages/(admin)/products/ProductsEdit";
import ProductsAdd from "./pages/(admin)/products/ProductsAdd";
import ProductsDetail from "./pages/(admin)/products/ProductsDetail";
import AddPromotion from "./pages/(admin)/Promotion/AddPromotion";
import UpdatePromotion from "./pages/(admin)/Promotion/UpdatePromotion";
import Promotion from "../../backend/models/Promotion";

import BrandList from "./pages/(admin)/Brands/BrandList";
import BrandAdd from "./pages/(admin)/Brands/BrandAdd";
import BrandEdit from "./pages/(admin)/Brands/BrandEdit";
import BrandDetail from "./pages/(admin)/Brands/BrandDetail";
import AdminListComment from "./pages/(admin)/Comment/ListComments";
import AdminDetailComment from "./pages/(admin)/Comment/DetailComment";
function App() {
  const configRouter = createBrowserRouter([
=======
import ListOrder from "./pages/(admin)/order/ListOrder";
import UpdateOrderStatus from "./pages/(admin)/order/UpdateOrderStatus";
function App() {
  const configRouter = createBrowserRouter([
    // Layout Admin
>>>>>>> dao-duy-khanh
    {
      element: <LayoutAdmin />,
      children: [
        // dashboard admin
<<<<<<< HEAD

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
          element: <AddCategory />,
        },
        {
          path: "/categorys/updatecategory/:id",
          element: <UpdateCategory />,
        },
        {
          path: "/ProductsList",
          element: <ProductsList />,
        },
        {
          path: "/ProductsEdit/:id",
          element: <ProductsEdit />,
        },

        {
          path: "/ProductsAdd",
          element: <ProductsAdd />,
        },
        {
          path: "/ProductsDetail/:id",
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
          path: "/comments",
          element: <AdminListComment />,
        },
        {
          path: "/comments/:id",
          element: <AdminDetailComment />,
        },
        {
          path: "/promotions",
          element: <Promotion />,
        },
        {
          path: "/add/promotion",
          element: <AddPromotion />,
        },
        {
          path: "/edit/promotion/:id",
          element: <UpdatePromotion />,
=======
        {
          path: "/dashboard",
          element: <DashBoard />,
        },
        {
          path: "/listorder",
          element: <ListOrder />,
        },
        {
          path: "/orders/updateStatus/:id",
          element: <UpdateOrderStatus />,
>>>>>>> dao-duy-khanh
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
