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
