import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";
import BrandList from "./pages/(admin)/Brands/BrandList";
import BrandAdd from "./pages/(admin)/Brands/BrandAdd";
import BrandEdit from "./pages/(admin)/Brands/BrandEdit";
import BrandDetail from "./pages/(admin)/Brands/BrandDetail";
function App() {
  const configRouter = createBrowserRouter([
    // Layout Admin
    {
      element: <LayoutAdmin />,
      children: [
        // dashboard admin
        {
          path: "/",
          element: <DashBoard />,
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
