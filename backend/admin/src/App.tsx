import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/LayoutAdmin";
import DashBoard from "./pages/DashBoard";
import ListProduct from "./pages/Products/ListProduct";
import ListBrand from "./pages/Brands/ListBrand";
import AddBrand from "./pages/Brands/AddBrand";
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
          element: <ListProduct />,
        },
        {
          path: "/brands",
          element: <ListBrand />,
        },
        {
          path: "/brands/add",
          element: <AddBrand />,
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
