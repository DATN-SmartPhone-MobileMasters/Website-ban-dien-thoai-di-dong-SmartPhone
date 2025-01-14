import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";
import UserList from "./pages/(admin)/User/UserList";
import UserDetails from "./pages/(admin)/User/UserDetails";
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
