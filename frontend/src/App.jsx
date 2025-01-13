import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";
import AdminListComment from "./pages/Comment/ListComments";
import AdminDetailComment from "./pages/Comment/DetailComment";
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
