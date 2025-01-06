import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/LayoutAdmin";
import DashBoard from "./pages/DashBoard";
import Products from "./pages/Products/ProductList";
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
