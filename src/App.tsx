import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/LayoutAdmin";
import DashBoard from "./pages/DashBoard";
import Products from "./pages/Products/ProductList";
import Accounts from "./pages/Users/UserList";
import UserDetails from "./pages/Users/UserDetails";

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
        {
          path: "/accounts",
          element: <Accounts />,
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

