import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";
import ListOrder from "./pages/(admin)/order/ListOrder";
import UpdateOrderStatus from "./pages/(admin)/order/UpdateOrderStatus";
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
          path: "/listorder",
          element: <ListOrder />,
        },
        {
          path: "/orders/updateStatus/:id",
          element: <UpdateOrderStatus />,
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
