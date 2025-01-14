import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";

import ProductsList from "./pages/(admin)/products/ProductsList";
import ProductsEdit from "./pages/(admin)/products/ProductsEdit";
import ProductsAdd from "./pages/(admin)/products/ProductsAdd";
import ProductsDetail from "./pages/(admin)/products/ProductsDetail";
function App() {
  const configRouter = createBrowserRouter([
    {
      element: <LayoutAdmin />,
      children: [

import BrandList from "./pages/(admin)/Brands/BrandList";
import BrandAdd from "./pages/(admin)/Brands/BrandAdd";
import BrandEdit from "./pages/(admin)/Brands/BrandEdit";
import BrandDetail from "./pages/(admin)/Brands/BrandDetail";
import AdminListComment from "./pages/(admin)/Comment/ListComments";
import AdminDetailComment from "./pages/(admin)/Comment/DetailComment";
function App() {
  const configRouter = createBrowserRouter([

    {
      element: <LayoutAdmin />,
      children: [
        // dashboard admin

        {
          path: "/",
          element: <DashBoard />,
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
        }
        ,
        {
          path: "/ProductsDetail/:id",
          element: <ProductsDetail />,
        }
        
    

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
