import { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LayoutAdmin from "./pages/(admin)/LayoutAdmin";
import DashBoard from "./pages/(admin)/DashBoard";
import ProductsList from "./pages/(admin)/products/ProductsList";
import ProductsEdit from "./pages/(admin)/products/ProductsEdit";
import ProductsAdd from "./pages/(admin)/products/ProductsAdd";
import ProductsDetail from "./pages/(admin)/products/ProductsDetail";
import CategoryList from "./pages/(admin)/categorys/CategoryList";
import CategoryAdd from "./pages/(admin)/categorys/CategoryAdd";
import CategoryUpdate from "./pages/(admin)/categorys/CategoryUpdate";
import BrandList from "./pages/(admin)/brands/BrandList";
import BrandAdd from "./pages/(admin)/brands/BrandAdd";
import BrandEdit from "./pages/(admin)/brands/BrandEdit";
import BrandDetail from "./pages/(admin)/brands/BrandDetail";
import UserList from "./pages/(admin)/User/UserList";
import UserDetails from "./pages/(admin)/User/UserDetails";
import AdminListComment from "./pages/(admin)/comments/ListComments";
import AdminDetailComment from "./pages/(admin)/comments/DetailComment";
import OderDetail from "./pages/(admin)/orders/Oderdetail";
import OderList from "./pages/(admin)/orders/Oderlist";
import Promotion from "./pages/(admin)/Promotion/Promotion";
import UpdatePromotion from "./pages/(admin)/Promotion/UpdatePromotion";
import AddPromotion from "./pages/(admin)/Promotion/AddPromotion";
import LayoutWebsite from "./pages/(website)/LayoutWebsite";
import "font-awesome/css/font-awesome.min.css";
import HomePage from "./pages/(website)/HomePage";
import ProductList from "./pages/(website)/Products/ProductList";
import ProductDetail from "./pages/(website)/Products/ProductDetail";
import LoginForm from './pages/(website)/Users/login-form';
import SignupForm from './pages/(website)/Users/signup-form';
import ForgotPassword from "./pages/(website)/Users/forgot-password";
import ResetPassword from "./pages/(website)/Users/reset-password";
import AccountPage from "./pages/(website)/Users/account";
import ProfileResetPasswordPage from "./pages/(website)/Users/profile-reset-password";
import AccountDetails from "./pages/(website)/Users/account-details";
import Cart from "./pages/(website)/Cart/Cart";
import AboutList from "./pages/(website)/about/AboutList";
import Blogdefault from "./pages/(website)/Blog/blogdefault";
import Blogsingle from "./pages/(website)/Blog/Blogsingle";
function App() {
  const configRouter = createBrowserRouter([
    {
      element: <LayoutAdmin />,
      children: [
        {
          path: "/admin/dashboard",
          element: <DashBoard />,
        },
        {
          path: "/admin/categorys",
          element: <CategoryList />,
        },
        {
          path: "/admin/categorys/addcategory",
          element: <CategoryAdd />,
        },
        {
          path: "/admin/categorys/update/:id",
          element: <CategoryUpdate />,
        },
        {
          path: "/admin/products",
          element: <ProductsList />,
        },
        {
          path: "/admin/products/edit/:id",
          element: <ProductsEdit />,
        },

        {
          path: "/admin/products/add",
          element: <ProductsAdd />,
        },
        {
          path: "/admin/products/detail/:id",
          element: <ProductsDetail />,
        },
        {
          path: "/admin/brands",
          element: <BrandList />,
        },
        {
          path: "/admin/brands/add",
          element: <BrandAdd />,
        },
        {
          path: "/admin/brands/edit/:id",
          element: <BrandEdit />,
        },
        {
          path: "/admin/brands/detail/:id",
          element: <BrandDetail />,
        },
        {
          path: "/admin/accounts",
          element: <UserList />,
        },
        {
          path: "/admin/accounts/:id",
          element: <UserDetails />,
        },
        {
          path: "/admin/comments",
          element: <AdminListComment />,
        },
        {
          path: "/admin/comments/:id",
          element: <AdminDetailComment />,
        },
        {
          path: "/admin/orders",
          element: <OderList />,
        },
        {
          path: "/admin/orders/:id",
          element: <OderDetail />,
        },
        {
          path: "/admin/vouchers",
          element: <Promotion />,
        },
        {
          path: "/admin/vouchers/add",
          element: <AddPromotion />,
        },
        {
          path: "/admin/vouchers/edit/:id",
          element: <UpdatePromotion />,
        },
      ],
    },
    {
      element: <LayoutWebsite />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/products",
          element: <ProductList />,
        },
        {
          path: "/products/product_detail/1",
          element: <ProductDetail />,
        },
        {
          path: "/login",
          element: <LoginForm />,
        },
        {
          path: "/signup",
          element: <SignupForm />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
        {
          path: "/account-details/:id",
          element: <AccountDetails />,
        },
        {
          path: "/account/:id",
          element: <AccountPage />,
        },
        {
          path: "/profile-reset-password/:id",
          element: <ProfileResetPasswordPage />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/about",
          element: <AboutList />,
        },
        {
          path: "/blog",
          element: <Blogdefault />,
        },
        {
          path: "/blog/sigle",
          element: <Blogsingle />,
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
