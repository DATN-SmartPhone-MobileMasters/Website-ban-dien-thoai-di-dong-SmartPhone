import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";
import CategoryList from "./pages/(admin)/categorys/CategoryList";
import AddCategory from "./pages/(admin)/categorys/AddCategory";
import UpdateCategory from "./pages/(admin)/categorys/UpdateCategory";
function App() {
  const configRouter = createBrowserRouter([
    // Layout Admin
    {
      element: <LayoutAdmin />,
      children: [
        // dashboard admin
        {
          path: "/dashboard",
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
