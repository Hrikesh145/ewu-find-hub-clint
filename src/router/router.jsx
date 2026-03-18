import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import AllItems from "../pages/AllItems/AllItems";
import Center from "../pages/Center/Center";
import AddItems from "../pages/AddItems/AddItems";
import AllRecovered from "../pages/AllRecovered/AllRecovered";
import ManageMyItems from "../pages/ManageMyItems/ManageMyItems";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "allItems",
        Component: AllItems,
      },
      {
        path: "center",
        Component: Center,
      },
      {
        path: "addItems",
        Component: AddItems,
      },
      {
        path: "allRecovered",
        Component: AllRecovered,
      },
      {
        path: "myItems",
        Component: ManageMyItems,
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
]);
